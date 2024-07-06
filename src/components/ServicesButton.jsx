import React, { useState } from "react";
import { TinyColor } from "@ctrl/tinycolor";
import { Modal, Button, ConfigProvider, Space, Select } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const colors1 = ["#fc6076", "#FF0000"];
const colors2 = ["#A4FF6B", "#008000"];
const getHoverColors = (colors) => colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) => colors.map((color) => new TinyColor(color).darken(5).toString());

const ServicesButton = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ id: 1, serialNo: "5342", description: "", rate: 0, quantity: 0, tax: 1, total: 21 }]);
  const [size, setSize] = useState("middle");

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const services = ["Tasheel", "visa", "printing", "family visa"];
  const options = services.map((service) => ({ value: service }));

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      serialNo: "",
      description: "",
      rate: 0,
      quantity: 0,
      tax: 0,
      total: 0,
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (deleteRowId) => {
    console.log("deleteRowId", deleteRowId);
    deleteRowId === 1 ? setRows([...rows]) : setRows(rows.filter((row) => row.id !== deleteRowId));
  };

  return (
    <>
      <Space>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(135deg, ${colors1.join(", ")})`,
                colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(", ")})`,
                colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(", ")})`,
                lineWidth: 0,
              },
            },
          }}
        >
          <Button type="primary" size="large" className="h-20 w-44" onClick={showModal}>
            BILLING
          </Button>
        </ConfigProvider>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(90deg,  ${colors2.join(", ")})`,
                colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors2).join(", ")})`,
                colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(colors2).join(", ")})`,
                lineWidth: 0,
              },
            },
          }}
        >
          <Button
            type="primary"
            size="large"
            className="h-20 w-44"
            onClick={() => {
              navigate("/report");
            }}
          >
            REPORT
          </Button>
        </ConfigProvider>
      </Space>

      {/* modal */}
      <Modal
        className="flex justify-center "
        open={open}
        title="BILLING"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <Button type="primary">SAVE</Button>
            <CancelBtn />
          </>
        )}
      >
        <div className="container mx-auto">
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left"></th>
                  <th className="py-3 px-6 text-left"></th>
                  <th className="py-3 px-6 text-left">Serial No.</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Rate</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Tax</th>
                  <th className="py-3 px-6 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-right">
                      <TiPlus className="text-green-600 text-xl hover:text-gray-800 cursor-pointer" onClick={addRow} />
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <MdDeleteOutline className="text-red-600 text-xl hover:text-gray-800 cursor-pointer" onClick={() => deleteRow(row.id)} />
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{`${2634 + row.id}`}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <Space
                        direction="vertical"
                        style={{
                          width: "100%",
                        }}
                      >
                        <Select
                          size={size}
                          defaultValue="select"
                          onChange={handleChange}
                          style={{
                            width: 200,
                          }}
                          options={options}
                        />
                      </Space>
                    </td>
                    <td className="py-3 px-6 text-left ">
                      <input type="number" className="form-input w-14 h-7 rounded text-center" defaultValue={row.rate} />
                    </td>
                    <td className="py-3 px-6 text-left flex justify-center">
                      <input type="number" className="form-input w-8 h-7 rounded text-center" defaultValue={row.quantity} />
                    </td>
                    <td className="py-3 px-6 text-center">{row.tax}</td>
                    <td className="py-3 px-6 text-right">{row.total}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <td colSpan="7" className="py-3 px-6 text-right font-bold">
                    Grand Total
                  </td>
                  <td className="py-3 px-6 text-right font-bold">$65.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServicesButton;
