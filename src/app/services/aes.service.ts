import { Injectable } from '@angular/core';

import { Character } from '~models';

@Injectable({
  providedIn: 'root'
})
export class AesService {
  private keys: CryptoKey[] = [];

  constructor() {
    const privateKeys = [
      'B75B85D56FDD97B27FB56780AE64CA9ADAEDE70981C00AF26D163BFBFB9AC66D',
      'BB43B5B5AF5C94B473AD57E06EE5C99CD6F5D769414109F4610E0B9B3B1BC56B',
      'A373D5752E5F92B86B9D3720EFE6CF90CEC5B7A9C0420FF8793E6B5BBA18C367',
      '931315F42D599EA05BFDF7A1ECE0C388FEA57728C34403E0495EABDAB91ECF7F',
      'F3D394F72B5586903B3D76A2EAECDBB89E65F62BC5481BD0299E2AD9BF12D74F',
      '335297F1274DB6F0FBBC75A4E6F4EBD85EE4F52DC9502BB0E91F29DFB30AE72F',
      'B25191FD3F7DD6307ABF73A8FEC48B18DFE7F321D1604B70681C2FD3AB3A87EF',
      'B1579DE50F1D16B179B97FB0CEA44B99DCE1FF39E1008BF16B1A23CB9B5A476E'
    ];

    const importedKeys = privateKeys.map(key => {
      return window.crypto.subtle.importKey(
        'raw',
        new Uint8Array(key.match(/../g)!.map(h => parseInt(h, 16))).buffer,
        {
          name: 'AES-CBC'
        },
        true,
        ['encrypt', 'decrypt']
      );
    });

    Promise.all(importedKeys).then(keys => (this.keys = keys));
  }

  /**
   * Decrypt the specified file and return the chracter
   * @throws when the file is not long enough or the file can't be decrypted
   * @param file file to decrypt
   * @param saveIndex the index of the save file, for example: <index>.json.enc
   * @returns the character object in the encrypted file
   */
  async decryptCharacterSaveFile(file: File, saveIndex: number): Promise<Character> {
    const bytes = await this.readBytes(file);
    const key = this.keys[saveIndex % 8];
    // TODO: Check if file is "long" enough (More than 16 bytes). This should only be the case if an invalid file is passed
    const cipherText = new Uint8Array(bytes.buffer.slice(0, bytes.length - 16));
    const iv = new Uint8Array(bytes.buffer.slice(bytes.length - 16));
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      cipherText
    );

    const decoder = new TextDecoder('utf-8');
    const characterJson = decoder.decode(new Uint8Array(decryptedBuffer));
    return JSON.parse(characterJson) as Character;
  }

  /**
   * Encrypt the specified character data with the proper private key
   * @param character the character to encrypt
   * @param saveIndex the index of the save file, for example: <index>.json.enc
   * @returns the encrypted character as byte array
   */
  async encryptCharacterSaveFile(character: Character, saveIndex: number): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const emptyIV = new Uint8Array(16);
    const key = this.keys[saveIndex % 8];
    const buffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: emptyIV
      },
      key,
      encoder.encode(JSON.stringify(character))
    );

    return new Uint8Array([...new Uint8Array(buffer), ...emptyIV]);
  }

  /**
   * Read and return the bytes of a specified file
   * @param file save file
   * @returns byte array of the save file
   */
  private readBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = function (evt) {
        if (evt.target?.readyState == FileReader.DONE) {
          const arrayBuffer = evt.target.result as ArrayBuffer;
          const byteArray = new Uint8Array(arrayBuffer);
          resolve(byteArray);
        }
      };
    });
  }
}
