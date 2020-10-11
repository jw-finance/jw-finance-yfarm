const promisify = (func) =>
  new Promise((resolve, reject) =>
    func((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    }));

const pageRefresh = (interval) => {
  setTimeout(function() {
      window.location.reload();
    },
    interval);
};

const getParameter = (name) => {
  var url = new URL(window.location.href);
  var value = url.searchParams.get(name);
  return value;
};

const copyToClipboard = element => {
  const el = document.createElement("textarea");
  el.value = $(element).val();
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const updateCurrentGasPrice = async (fetchUrl) => {
  $.ajax({
    url: fetchUrl,
    method: "GET",
    success: function(result) {
      window.currentGasPrice = result;
      return true;
    },
    error: function(jqXHR, exception) {
      console.log(jqXHR);
      return false;
    }
  });
};

const countdown = (elementId, date) => {
  $(`#${elementId}`).countdown(date).on("update.countdown",
    function(event) {
      $(this).html(event.strftime("" +
        '<div><span class="mr-2">%D</span> Day%!d</div>' +
        '<div><span class="mr-2">%H</span> Hr</div>' +
        '<div><span class="mr-2">%M</span> Min</div>' +
        '<div><span class="mr-2">%S</span> Sec</div>'));
    });
};

function waitForWalletConnectThenChangeButton() {
    if (typeof selectedAccount !== "undefined") {
        $(".connect").text("Wallet Connected").addClass("disabled");
    }
    else {
        setTimeout(waitForWalletConnectThenChangeButton, 250);
    }
}