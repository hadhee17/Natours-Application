import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${API_URL}/login`, // 🔥 dynamic
      data: { email, password },
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      showAlert('error', err.response.data.message);
    } else {
      showAlert('error', 'Error logging in. Please try again.');
    }
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${API_URL}/logout`, // 🔥 dynamic
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
