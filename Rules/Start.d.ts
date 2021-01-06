import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
export declare class Start extends Rule<[], void> {}
export default Start;
export interface IStartRegistry extends IRuleRegistry<Start, [], void> {}
