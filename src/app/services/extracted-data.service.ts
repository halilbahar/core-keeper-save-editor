import { Injectable } from '@angular/core';

import { Data } from '~config';
import { ExtractedData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class ExtractedDataService {
  readonly data = Data as unknown as ExtractedData;
}
