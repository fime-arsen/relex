import Dispatcher from '../dispatcher/RelaxDispatcher';
import RelaxConstants from '../constants/RelaxConstants';

class RelaxActions {

  set_result_json() {
    // Note: This is usually a good place to do API calls.
    Dispatcher.dispatch({
      actionType: RelaxConstants.SET_RESULT_JSON,
      data: {name: "Karen"}
    });
  }
}

export default new RelaxActions()
