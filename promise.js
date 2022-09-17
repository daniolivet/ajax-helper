const ajax = (user) => {
  const xmlhttp = new XMLHttpRequest();

  new Promise((resolve, reject) => {
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200 && user.success) {
          resolve(
            user.parse ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText
          );
        } else {
          function other(error, text) {
            console.error(
              `ajaxSM: Error on ajax call to ${user.url} ${error} - ${text}`
            );
          }

          if (user.error) {
            user.error.other = user.error.other || other;
          } else {
            user.error = { other: other };
          }
          reject({
            status: xmlhttp.status,
            statusText: xmlhttp.statusText,
          });
        }
      }
    };
    let sent = null;
    if (user.data) {
      let params = [];
      for (let key in user.data) {
        params.push(key + "=" + user.data[key]);
      }

      user.type === "GET"
        ? (user.url += "?" + params.join("&"))
        : (sent = params.join("&"));
    }
    xmlhttp.open(user.type, user.url, user.async === undefined || user.async);
    if (sent) {
      xmlhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      // xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    }
    xmlhttp.send(sent);
  })
    .then((result) => {
      user.success(result);
    })
    .catch(({ status, statusText }) => {
    user.error[status](user.url, status, status)
  }
    );
};


const config = {
  url: "https://pokeapi.co/api/v2/pokerrrmon/ditto",
  type: "GET",
  parse: true,
  async: true,
  data: { firstName: "Foo", lastName: "Bar" },
  success: function (data) {
    console.log(data);
  },
  error: {
    0: function () {
      console.error("No response or CORS error");
    },
    403: function (url) {
      console.error(`Forbidden access to ${url}`);
    },
    404: function (url, errorCode, errorDescription) {
       console.error(`${url} not found with error code ${errorCode}`)
    },
    other: function (url, errorCode, errorDescription) {
      console.error(`Unrecognized error\n${errorCode} : ${errorDescription}`);
    },
  },
}


ajax(config)
