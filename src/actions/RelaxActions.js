import Dispatcher from '../dispatcher/RelaxDispatcher';
import RelaxConstants from '../constants/RelaxConstants';

class RelaxActions {

  set_result_json(user_input) {
    // Note: This is usually a good place to do API calls.
    fetch('http://192.168.112.199:5000/', {
      method: 'post',
      body: user_input,
      headers: new Headers({
        // 'Content-Type': 'application/json'
      })
    }).then(
      (response) => {
        if (response.status < 200 || response.status >= 300) {
          console.log('Looks like there was a problem. Status Code: ' +
          response.status);
          return;
        }

        response.json().then((data) => {
          Dispatcher.dispatch({
            actionType: RelaxConstants.SET_RESULT_JSON,
            data: data
          });
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  }
}

export default new RelaxActions()
