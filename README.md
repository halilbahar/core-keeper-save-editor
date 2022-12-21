# Core Keeper Save Editor

A simple browser based **Save File Editor** for **Core Keeper**.

## How to handle Core Keeper updates

### Skill balancing:

When they rebalance, use [Cheat Engine](https://www.cheatengine.org/) to extract the constants:

* Open `Cheat Engine` and select `Core Keeper`
* Select Mono > .Net Info (Ctrl + Alt + N) on the toolbar
* Select Pug.Other.dll on the left side
* Select SkillData in the middle
* Read the MulFactor and Base variables for all the skills and change it in our [SkillTalentSerivce](./src/app/services/skill-talent.service.ts)

### Conditions which are off of a factor of 10

There is a small logic when displaying conditions where certain skills needs to be divided by 10:

* Use [Il2CppDumper](https://github.com/Perfare/Il2CppDumper) and dump the code
* This will generate a `DummyDll`. Open that folder with [DnSpy](https://github.com/dnSpy/dnSpy).
* Find `Condition` in `Pug.Other` and find and copy the `VA` for `public static string GetConditionValueString(ConditionEffect effect, int value, bool showPlusSign)`
* Use [Ghidra](https://github.com/NationalSecurityAgency/ghidra) and open `GameAssembly.dll`
* Start analysing and go to the `VA` address with `Ctrl + G`
* Extract the if condition and adjust the current one in [conditions.py](./scripts/conditions.py)

### Items.py Warning

Certrain objects don't have `icons` or `translations` (not real items). We log these when extracting data. This helps us to identifiy false exclusion of the data. But when we are sure that these `objectIDs` are in fact not items we add them to our [blacklist.py](./scripts/blacklist.py).
