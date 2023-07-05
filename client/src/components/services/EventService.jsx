import axios from "./axios";

export async function getAllEvents(url) {
  return new Promise(function (resolve, reject) {
    axios
      .get(url)
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

export async function createEvent(url, data) {
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

export async function updateSingleEvent(url, data) {
  return new Promise(function (resolve, reject) {
    axios
      .patch(url, data)
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

export async function deleteSingleEvent(url) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(url)
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
