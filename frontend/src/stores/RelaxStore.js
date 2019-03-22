import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/RelaxDispatcher';
import RelaxConstants from '../constants/RelaxConstants';

const CHANGE = 'CHANGE';

let _relaxState = {
  is_loading: false,
  result_json: [],
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
      case RelaxConstants.SET_LOADING:
        this.set_loading(action.status);
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

  get_result_json() {
    return _relaxState.result_json;
  }

  set_loading(status) {
    _relaxState.is_loading=status
  }

  get_loading_status() {
    return _relaxState.is_loading;
  }
}

export default new RelaxStore();
