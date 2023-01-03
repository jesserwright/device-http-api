import { h, render } from "./preact.js";
import { useEffect, useState } from "./hooks.js";

function useDevices(request) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(request);
        const devicesResp = await response.json();
        setLoading(false);
        setDevices(devicesResp);
      } catch (error) {
        // if (instanceof error is NetworkError ..) { network error... } ...
        setErrorMsg(error.message);
      }
    })();
  }, []);

  return [loading, errorMsg, devices];
}

function App({ request }) {
  const [loading, errorMsg, devices] = useDevices(request);

  if (loading) {
    return h("h1", { className: "text-red text-center" }, "LOADING");
  }

  if (errorMsg) {
    return h("h1", { className: "text-red text-center" }, errorMsg);
  }

  return [
    h("h1", { className: "text-lg my-4 font-bold" }, "DEVICES"),
    h(DeviceList, { devices }),
    h(DeviceItem, { device: null }),
    h("footer", { className: "m-4" }),
  ];
}

function DeviceList({ devices }) {
  return devices.map((device) => h(DeviceItem, { device }));
}

function DeviceItem({ device }) {
  const [type, _setType] = useState(device?.type);
  const [version, _setVersion] = useState(device?.version);
  const [description, _setDescription] = useState(device?.description);

  const className =
    "py-1 px-2 mt-0.5 flex w-60 flex-col border focus:border-blue-700 rounded";

  return h(
    "div",
    { className: "px-3 pt-2 pb-3 border mb-4 bg-white rounded" },
    [
      h("div", { className: "mb-2 block" }, [
        h("span", { className: "text-sm text-gray-500" }, "Type"),
        h("input", { className, type: "text", value: type }),
      ]),
      h("div", { className: "mb-2 block" }, [
        h("span", { className: "text-sm text-gray-500" }, "Version"),
        h("input", { className, type: "number", value: version }),
      ]),
      h("div", { className: "mb-3 block" }, [
        h("span", { className: "text-sm text-gray-500" }, "Description"),
        h("input", { className, type: "text", value: description }),
      ]),
      device === null
        ? h("button", {
          className:
            "py-1 w-full text-sm font-medium border rounded text-blue-700 cursor-not-allowed",
        }, "CREATE")
        : h("div", { className: "flex flex-row justify-between" }, [
          h("button", {
            className:
              "grow py-1 mr-1 border font-medium text-sm rounded text-amber-700 cursor-not-allowed",
          }, "UPDATE"),
          h("button", {
            onClick: () => deleteDevice(device.id),
            className:
              "grow py-1 ml-1 border font-medium text-sm rounded text-rose-800 cursor-not-allowed",
          }, "DELETE"),
        ]),
    ],
  );
}

const INIT = new Request("/device");

render(h(App, { request: INIT }), document.getElementById("root"));
