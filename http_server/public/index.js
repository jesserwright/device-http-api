import { createElement as h, useEffect, useState } from "./react.js";
import ReactDOM from "./react-dom.js";

const BUTTON_STYLE = "text-blue-600 ml-3 underline text-right";

function useRequest(request) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setErrorMsg(null);
        setLoading(true);
        const response = await fetch(request);

        if (!response.ok) {
          setLoading(false);
          setErrorMsg(response.statusText);
          return;
        }

        if (request.method === "GET") {
          const devicesResp = await response.json();
          setDevices(devicesResp);
        } else {
          const _idResponse = await response.json();
          // Always reload when something changed
          const refreshReq = new Request("/device");
          const refreshReponse = await fetch(refreshReq);
          const refreshedDevices = await refreshReponse.json();
          setDevices(refreshedDevices);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMsg(error.message);
      }
    })();
  }, [request]);

  return [loading, errorMsg, devices];
}

function App() {
  const [request, setRequest] = useState(new Request("/device"));
  const [loading, errorMsg, devices] = useRequest(request);

  // null | 'New Device' | 'Edit Device' ... this is not ideal
  const [editorMode, setEditorMode] = useState(null);

  // State for editing *and* creating.
  // Can be used for both but must be be set and cleared carefully (!).
  // Starts with default values for the create state.
  const [type, setType] = useState("");
  const [version, setVersion] = useState(0);
  const [description, setDescription] = useState("");
  const [id, setId] = useState(null);

  function setDeviceInputsToDefaultEmpty() {
    setType("");
    setVersion(0);
    setDescription("");
    setId(null);
  }

  const systemMsgStyle = "mt-3 text-lg text-gray-500 text-center";

  if (loading) {
    return h("h1", {
      className: systemMsgStyle,
    }, "Loading");
  }

  if (errorMsg) {
    return h(
      "button",
      {
        className: systemMsgStyle,
        onClick: () => {
          setRequest(new Request("/device"));
        },
      },
      `${errorMsg}. Click to reset.`,
    );
  }

  if (editorMode) {
    return [
      h(Header, {
        title: editorMode,
        buttons: [
          h("button", {
            className: BUTTON_STYLE,
            onClick: () => {
              setEditorMode(null);
              setDeviceInputsToDefaultEmpty();
            },
          }, "Back"),
          h(
            "button",
            {
              className: BUTTON_STYLE,
              onClick: () => {
                // Create
                if (editorMode == "New Device") {
                  setRequest(
                    new Request("/device", {
                      method: "POST",
                      body: JSON.stringify({ type, version, description }),
                    }),
                  );
                }
                // Update
                if (editorMode == "Edit Device") {
                  setRequest(
                    new Request("/device", {
                      method: "PUT",
                      body: JSON.stringify({ id, type, version, description }),
                    }),
                  );
                }
                setEditorMode(null);
                setDeviceInputsToDefaultEmpty();
              },
            },
            editorMode === "New Device" ? "Create" : "Save",
          ),
          editorMode === "Edit Device" && h("button", {
            className: "ml-3 text-right underline text-red-600",
            onClick: () => {
              // Delete
              setRequest(
                new Request("/device", {
                  method: "DELETE",
                  body: JSON.stringify({ id }),
                }),
              );
              setDeviceInputsToDefaultEmpty();
              setEditorMode(null);
            },
          }, "Delete"),
        ],
      }),
      h(EditableDevice, {
        device: { id, type, version, description },
        setType,
        setVersion,
        setDescription,
      }),
    ];
  }

  return [
    h(Header, {
      title: "Devices",
      buttons: [
        h("button", {
          className: BUTTON_STYLE,
          onClick: () => setEditorMode("New Device"),
        }, "New"),
      ],
    }),
    h(DeviceList, {
      devices,
      setId,
      setEditorMode,
      setType,
      setVersion,
      setDescription,
    }),
  ];
}

function Header({ title, buttons }) {
  return h("div", {
    className: "flex justify-between border-b border-gray-900 mb-3 pb-1",
  }, [
    h(
      "h1",
      { className: "text-lg font-medium" },
      title,
    ),
    h("div", { className: "" }, buttons),
  ]);
}

function DeviceList(
  { devices, setId, setEditorMode, setType, setVersion, setDescription },
) {
  return devices.map((device) =>
    h(DisplayDevice, {
      ...device,
      setEditorMode,
      setId,
      setType,
      setVersion,
      setDescription,
    })
  );
}

function DisplayDevice(
  {
    id,
    type,
    version,
    description,
    setEditorMode,
    setId,
    setType,
    setVersion,
    setDescription,
  },
) {
  return h("div", {
    className: "flex flex-col bg-white border py-1 px-2 relative mb-3",
  }, [
    h("code", {
      className:
        "border-b border-l text-sm py-0.5 px-1.5 absolute top-0 right-0",
    }, version),
    h("h2", {}, type),
    h("p", { className: "text-sm text-gray-600 py-1" }, description),
    h(
      "button",
      {
        onClick: () => {
          setId(id);
          setType(type);
          setVersion(version);
          setDescription(description);
          setEditorMode("Edit Device");
        },
        className: `${BUTTON_STYLE} self-end`,
      },
      "Edit",
    ),
  ]);
}

function EditableDevice({ device, setType, setVersion, setDescription }) {
  const { type, version, description } = device;

  const fieldProps = [
    {
      name: "Type",
      nullable: false,
      type: "UTF-8",
      constraint: "Length 1-8",
      inputProps: {
        element: "input",
        type: "text",
        value: type,
        onChange: (e) => {
          e.preventDefault();
          // TODO: verify field input
          setType(e.target.value);
        },
      },
    },
    {
      name: "Version",
      nullable: false,
      type: "Integer",
      constraint: "Value 0-2147483647",
      inputProps: {
        element: "input",
        type: "number",
        value: version,
        min: 0,
        onChange: (e) => {
          e.preventDefault();
          // TODO: verify field input
          setVersion(e.target.value);
        },
      },
    },
    {
      name: "Description",
      nullable: false,
      type: "UTF-8",
      constraint: "Length 1-110",
      inputProps: {
        element: "textarea",
        value: description,
        onChange: (e) => {
          e.preventDefault();
          // TODO: verify field input
          setDescription(e.target.value);
        },
      },
    },
  ];

  // In DOM order
  const editableDeviceContainer = "px-3 pt-2 bg-white border";
  const fieldContainer = "mb-2.5 flex flex-col";
  const aboveInputContainer = "flex justify-between";
  const fieldNameStyle = "text-sm";
  const fieldTypeStyle = "text-xs text-gray-500";
  const inputStyle = "py-1 px-2 my-1 flex flex-col border max-h-32";

  return h("div", { className: editableDeviceContainer }, [
    fieldProps.map((field) =>
      h("div", { className: fieldContainer }, [
        h("div", { className: aboveInputContainer }, [
          h("div", { className: fieldNameStyle }, field.name),
          h(
            "div",
            { className: fieldTypeStyle },
            `${field.nullable ? "" : "Required ·"} ${field.type}`,
          ),
        ]),
        h(field.inputProps.element, {
          className: inputStyle,
          ...field.inputProps,
        }),
      ])
    ),
  ]);
}

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(h(App));
