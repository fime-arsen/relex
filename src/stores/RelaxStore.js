import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/RelaxDispatcher';
import RelaxConstants from '../constants/RelaxConstants';

const CHANGE = 'CHANGE';

let _relaxState = {
  result_json: [{"text":"Therefore, we cannot rule out that some variations in the binding of three apoE isotypes to Abeta peptides will be found when other apoE preparations are used.","extracted_information":[{"contains_implicit_entity":false,"label":1,"participant_ids":[0,1],"participant_b":"Abeta","participant_a":"apoE","interaction_type":"bind"}],"id":"50","unique_entities":{"0":{"labels_major":["protein"],"versions":{"apoE":{"mentions":[[132,135],[75,78]],"labels":["protein"],"labels_major":["protein"]}}},"1":{"labels_major":["protein"],"versions":{"Abeta":{"mentions":[[92,96]],"labels":["protein"],"labels_major":["protein"]}}}}},{"text":"Briefly, the oligonucleotide library was incubated with fusion proteins bound to either GST-coated bead-bound fusion proteins (GST-tag) or nickel/nitrilotriacetic acid matrix-bound fusion proteins (histidine-tag) in a buffer containing 20 mM Tris (pH 8.0), 50 mM KCl, 1 mM DTT, 0.5 mM EDTA, 10% glycerol, 20 \u03bcg/ml BSA, and 2 \u03bcg/ml poly(dI)\u22c5poly(dc).","extracted_information":[],"id":"97","unique_entities":{}},{"text":"Additional experiments were therefore performed to clarify whether the  Vps10p cd could in fact bind to  human GGA1 and  GGA2.","extracted_information":[{"contains_implicit_entity":false,"label":1,"participant_ids":[1,0],"participant_b":"Vps10p cd","participant_a":"GGA2","interaction_type":"bind"}],"id":"115","unique_entities":{"0":{"labels_major":["DNA"],"versions":{"Vps10p cd":{"mentions":[[72,80]],"labels":["DNA"],"labels_major":["DNA"]}}},"1":{"labels_major":["protein"],"versions":{"GGA2":{"mentions":[[121,124]],"labels":["protein"],"labels_major":["protein"]}}}}}]
}

class RelaxStore extends EventEmitter {

  constructor() {
    super();
    // Registers action handler with the Dispatcher.
    Dispatcher.register(this._registerToActions.bind(this));
  }

  // Switches over the action's type when an action is dispatched.
  _registerToActions(action) {
    switch(action.actionType) {
      case RelaxConstants.SET_RESULT_JSON:
        this.set_result_json(action.data);
        break;
      default:
        console.log("Unhandled case");
        break;
    }
    this.emit(CHANGE);
  }

  set_result_json(data) {
    _relaxState.result_json = data;
  }

  get_result_json(data) {
    return _relaxState.result_json;
  }
}

export default new RelaxStore();
