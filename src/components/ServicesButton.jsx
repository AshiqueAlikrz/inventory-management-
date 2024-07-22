import React, { useContext, useEffect, useState } from "react";
import { TinyColor } from "@ctrl/tinycolor";
import { Modal, Button, ConfigProvider, Space, Select } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import Invoice from "./Invoice";
import { useNavigate } from "react-router-dom";
import { billingDataContext } from "../contexts/DataContext";
import { IoMdPrint } from "react-icons/io";
import { ourServices } from "../data/Solutions";
import { notification } from "antd";
import { toast } from "react-toastify";

const colors1 = ["#fc6076", "#FF0000"];
const colors2 = ["#A4FF6B", "#008000"];
const getHoverColors = (colors) => colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) => colors.map((color) => new TinyColor(color).darken(5).toString());

const ServicesButton = () => {
  const navigate = useNavigate();
  const { billingData, setBillingData } = useContext(billingDataContext);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ id: 1, description: "", quantity: "", rate: "", tax: 1, total: 0 }]);
  const [inputFields, setInputFields] = useState(false);

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

  // Calculate totalAmount based on items totals

  const deleteRow = (deleteRowId) => {
    console.log(deleteRowId);
    setRows(rows?.filter((row, index) => index !== deleteRowId));
    if (deleteRowId > -1) {
      // rows?.splice(deleteRowId, 1);
      billingData?.items?.splice(deleteRowId, 1);
    }
  };

  //input values
  let discount = 0;

  const handleInputChange = (value, name, rowId) => {
    // console.log(value, name, rowId);
    if (name === "discount") {
      discount = Number(value);
      setBillingData((prevState) => ({
        ...prevState,
        discount,
      }));
    }
    const updatedRows = rows?.map((row) => (row.id === rowId ? { ...row, [name]: value } : row));
    // const anyEmptyFields = updatedRows?.some((item) => item.quantity === "" || item.rate === "" || item.description === "");
    // if (updatedRows.length === 1) {
    //   setInputFields(true);
    //   console.log("input", inputFields);
    // }
    setRows(updatedRows);
    const updatedItems = updatedRows.map((row) => ({
      id: Math.random() * 100,
      description: row.description,
      quantity: Number(row.quantity),
      rate: Number(row.rate),
      total: row.quantity * row.rate,
    }));

    setBillingData((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));
  };

  useEffect(() => {
    const totalAmount = billingData?.items?.reduce((acc, item) => acc + item.total, 0);
    setBillingData((prevState) => ({
      ...prevState,
      totalAmount: totalAmount - billingData?.discount,
      subTotal: totalAmount,
    }));
  }, [billingData.items, rows]);

  const inputCheck = () => {
    const isBillingDataInvalid = billingData.name === "" || billingData.date === "";
    const Itemselement = billingData?.items?.some((item) => item.description === " " || item.rate === "" || item.quantity === "");
    const rowsElement = rows?.some((item) => item.description === " " || item.rate === "" || item.quantity === "");
    if (isBillingDataInvalid || Itemselement || rowsElement) {
      return true;
    } else {
      return false;
    }
  };

  const addRow = () => {
    if (inputCheck()) {
      toast.warning("Fill the fields");
    } else {
      const newRow = {
        id: Math.random() * 100,
        description: "",
        rate: "",
        quantity: "",
        tax: 1,
        total: 0,
      };
      setRows([...rows, newRow]);
    }
    // }
  };

  const printInvoice = () => {
    console.log(inputCheck());
    if (inputCheck()) {
      toast.warning("Fill the fields");
    } else {
      setBillingData(billingData);
      navigate("/invoice");
      // setTimeout(() => {
      //   setBillingData([]);
      //   console.log("timeout billing", billingData);
      // }, 3000);
    }
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
        className="flex justify-center"
        open={open}
        title="BILLING"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="save"
            // type="primary"
            onClick={() => {
              {
                !inputCheck() && handleOk();
              }
              printInvoice();
            }}
          >
            <IoMdPrint />
            PRINT
          </Button>,

          <Button key="cancel" type="primary" danger onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="container mx-auto">
          <div className="flex justify-between h-9 w-full bg-slate-100">
            <div className="flex items-center gap-2 h-9 w-3/6">
              <h2 className="font-semibold text-base mx-1">Name :</h2>
              <input
                type="text"
                required
                name="name"
                value={billingData.name}
                onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                className="h-8 w-4/6 rounded-md  p-1 font-semibold "
              />
            </div>
            <div className="flex justify-end items-center gap-2 h-9 w-2/6">
              <h2 className="font-semibold text-base">Date :</h2>
              <div className="flex space-x-4">
                <div className="w-full justify-center items-center flex">
                  <input
                    required
                    // placeholder="Enter birth date"
                    name="date"
                    value={billingData.date}
                    onChange={(e) => setBillingData({ ...billingData, date: e.target.value })}
                    type="date"
                    className="relative w-full h-8 outline-none text-gray-500 rounded-lg p-2.5 focus:shadow-md mx-2 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-right">{rows.length < 1 && <TiPlus className="text-green-600 text-xl hover:text-gray-800 cursor-pointer" onClick={addRow} />}</th>
                  <th className="py-3 px-6 text-left"></th>
                  <th className="py-3 px-6 text-left">Serial.No</th>
                  <th className="py-3 px-6 text-center">Description</th>
                  <th className="py-3 px-6 text-left">Rate</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {rows.map((row, index) => (
                  <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-right">
                      <TiPlus className="text-green-600 text-xl hover:text-gray-800 cursor-pointer" onClick={() => addRow(index)} />
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <MdDeleteOutline className="text-red-600 text-xl hover:text-gray-800 cursor-pointer" onClick={() => deleteRow(index)} />
                    </td>
                    <td className="py-3 px-6 text-center font-semibold">{index + 1}</td>
                    <td className="py-3 px-16 text-left whitespace-nowrap font-semibold">
                      <Select
                        className="w-72"
                        showSearch
                        style={{
                          width: 200,
                        }}
                        placeholder="Search to Select"
                        optionFilterProp="label"
                        name="description"
                        filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                        onChange={(value) => handleInputChange(value, "description", row.id)}
                        options={ourServices}
                      />
                    </td>
                    <td className="py-3 px-2 text-left">
                      <input
                        type="number"
                        className="form-input w-16 h-7 rounded text-center border font-semibold"
                        name="rate"
                        value={row.rate}
                        onChange={(e) => handleInputChange(e.target.value, "rate", row.id)}
                      />
                    </td>
                    <td className="py-3 px-2 text-left flex justify-center">
                      <input
                        type="number"
                        className="form-input w-16 h-7 rounded text-center border font-semibold"
                        name="quantity"
                        required
                        value={row.quantity}
                        onChange={(e) => handleInputChange(e.target.value, "quantity", row.id)}
                      />
                    </td>
                    {/* <td className="py-3 px-6 text-center font-semibold">{row.tax}</td> */}
                    <td className="py-3 px-6 text-center font-semibold"> {(row.quantity * row.rate).toFixed(2)}</td>
                  </tr>
                ))}

                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <td colSpan="6" className="py-3 px-6 text-right font-bold">
                    Discount
                  </td>
                  <td className="py-3 px-2 text-left flex justify-center">
                    <input
                      type="number"
                      className="form-input w-16 h-7 rounded text-center border font-semibold"
                      name="quantity"
                      required
                      onChange={(e) => handleInputChange(e.target.value, "discount")}
                    />
                  </td>
                </tr>

                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <td colSpan="6" className="py-3 px-6 text-right font-bold">
                    Grand Total
                  </td>
                  <td className="py-3 px-6 text-right font-bold">AED {billingData?.totalAmount?.toFixed(2)}</td>
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
