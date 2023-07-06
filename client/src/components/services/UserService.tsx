import axios from "axios";

export async function authenticateApi(url, data) {
  return new Promise(function (resolve, reject) {
    axios
      .post(url, data)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (error) {
        let errorMsg = "";
        if (error?.response?.data?.message) {
          errorMsg = error?.response?.data?.message;
        } else {
          errorMsg = error.message;
        }
        reject(errorMsg);
      });
  });
}
