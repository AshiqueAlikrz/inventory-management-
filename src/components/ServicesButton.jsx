import React, { useContext, useEffect, useMemo, useState } from "react";
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
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import FormItem from "antd/es/form/FormItem";

const colors1 = ["#fc6076", "#FF0000"];
const colors2 = ["#A4FF6B", "#008000"];
const getHoverColors = (colors) => colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) => colors.map((color) => new TinyColor(color).darken(5).toString());

const ServicesButton = () => {
  const navigate = useNavigate();
  const { billingData, setBillingData } = useContext(billingDataContext);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ id: "", description: "", quantity: "", rate: "", tax: 1, total: 0 }]);
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

  const addRow = (index) => {
    const newRow = { id: index + 1, description: "", rate: "", quantity: "" };
    formik.setFieldValue("items", [...formik.values.items, newRow]);
  };

  const deleteRow = (deleteRowId) => {
    if (deleteRowId > -1) {
      const updatedItems = formik.values.items.filter((item, index) => index !== deleteRowId);
      formik.setFieldValue("items", updatedItems);
    }
  };
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    date: Yup.date().required("Date is required"),
    invoice: Yup.string().required("Invoice number is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().required("Description is required"),
          quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
          rate: Yup.number().required("Rate is required").min(1, "Rate must be at least 1"),
        })
      )
      .required("At least one item is required"),
  });

  const formik = useFormik({
    initialValues: billingData,
    validationSchema,
    onSubmit: (values, { resetForm, setSubmitting, setErrors }) => {
      setBillingData(values);
      navigate("/invoice");
      // resetForm();
    },
  });

  useEffect(() => {
    formik.values.items.forEach((item, index) => {
      const formattedTotal = parseFloat(((item.quantity || 0) * (item.rate || 0)).toFixed(2));
      formik.setFieldValue(`items[${index}].total`, formattedTotal);
    });
  }, [formik.values.items, formik.setFieldValue]);

  const subTotal = useMemo(() => {
    return formik.values.items.reduce((acc, item) => acc + item.total, 0);
  }, [formik.values.items]);

  const grandTotal = useMemo(() => {
    const total = subTotal - formik.values.discount;
    return total;
  }, [formik.values.items, formik.values]);

  // const formattedDate = useMemo(() => {
  //   const date = new Date(formik.values.date);
  //   console.log("date: " + date);
  //   return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  // }, [formik.values.date]);

  const handleReset = () => {
    formik.resetForm();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const newRow = { id: 0, description: "", rate: "", quantity: "" };
      formik.setFieldValue("items", [...formik.values.items, newRow]);
    }
  };

  useEffect(() => {
    formik.setFieldValue("subTotal", subTotal);
    formik.setFieldValue("grandTotal", grandTotal);
  }, [subTotal, grandTotal]);


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
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="save" onClick={formik.handleSubmit}>
            <IoMdPrint />
            PRINT
          </Button>,
          <Button key="cancel" type="primary" danger onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="" type="dashed" danger onClick={handleReset}>
            Reset
          </Button>,
        ]}
      >
        <div className="container mx-auto">
          <form>
            <div className="flex justify-between h-9 w-full bg-slate-100">
              <div className="flex items-center gap-2 h-9 w-3/6">
                <h2 className="font-semibold text-base mx-1">Name :</h2>
                <input type="text" required name="name" value={formik.values.name} onChange={formik.handleChange} className="h-8 w-4/6 rounded-md  p-1 font-semibold " />
                {/* {formik.errors.name && formik.touched.name ? <div className="text-red-600">{formik.errors.name}</div> : null} */}
              </div>

              <div className="flex items-center gap-2 h-9 w-3/6">
                <h2 className="font-semibold text-base mx-1">Invoice :</h2>
                <input type="number" required name="invoice" value={formik.values.invoice} onChange={formik.handleChange} className="h-8 w-3/6 rounded-md  p-1 font-semibold " />
                {/* {formik.errors.invoice && formik.touched.invoice ? <div className="text-red-600">{formik.errors.invoice}</div> : null} */}
              </div>

              <div className="flex justify-end items-center gap-2 h-9 w-2/6">
                <h2 className="font-semibold text-base">Date :</h2>
                <div className="flex space-x-4">
                  <div className="w-full justify-center items-center flex">
                    <input
                      required
                      name="date"
                      type="date"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      className="relative w-full h-8 outline-none text-gray-500 rounded-lg p-2.5 focus:shadow-md mx-2 font-semibold"
                    />
                    {/* {formik.errors.date && formik.touched.date ? <div className="text-red-600">{formik.errors.date}</div> : null} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-6 flex justify-between">
              {formik.errors.name && formik.touched.name ? <div className="text-red-600">{formik.errors.name}</div> : null}
              {formik.errors.invoice && formik.touched.invoice ? <div className="text-red-600">{formik.errors.invoice}</div> : null}
              {formik.errors.date && formik.touched.date ? <div className="text-red-600">{formik.errors.date}</div> : null}
            </div>
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-right">{formik?.values?.items?.length < 1 && <TiPlus className="text-green-600 text-xl hover:text-gray-800 cursor-pointer" onClick={addRow} />}</th>
                    <th className="py-3 px-6 text-left"></th>
                    <th className="py-3 px-6 text-left">Serial.No</th>
                    <th className="py-3 px-6 text-center">Description</th>
                    <th className="py-3 px-6 text-left">Rate</th>
                    <th className="py-3 px-6 text-center">Quantity</th>
                    <th className="py-3 px-6 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {formik?.values?.items?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
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
                          filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                          // onChange={(value) => handleInputChange(value, "description", row.id)}
                          // name='description'
                          name={`items[${index}].description`}
                          value={formik?.values?.items[index]?.description}
                          onChange={(value) => formik.setFieldValue(`items[${index}].description`, value)}
                          options={ourServices}
                        />
                        {formik.errors.items && formik.touched.items && formik.errors.items[index]?.description && formik.touched.items[index]?.description && (
                          <div className="text-red-600 font-thin text-xs">{formik.errors.items[index].description}</div>
                        )}
                      </td>

                      <td className="py-3 px-2 text-left ">
                        <input
                          type="number"
                          className="form-input w-16 h-7 rounded text-center border font-semibold"
                          name={`items[${index}].rate`}
                          value={formik?.values?.items[index]?.rate}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.items && formik.touched.items && formik.errors.items[index]?.rate && formik.touched.items[index]?.rate && (
                          <div className="text-red-600 text-xs">{formik.errors.items[index].rate}</div>
                        )}
                      </td>

                      <td className="py-3 px-2 text-center ">
                        <input
                          type="number"
                          className="form-input w-16 h-7 rounded text-center border font-semibold"
                          required
                          onKeyDown={handleKeyDown}
                          name={`items[${index}].quantity`}
                          value={formik?.values?.items[index]?.quantity}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.items && formik.touched.items && formik.errors.items[index]?.quantity && formik.touched.items[index]?.quantity && (
                          <div className="text-red-600 text-xs">{formik.errors.items[index].quantity}</div>
                        )}
                      </td>
                      <td
                        className="py-3 px-6 text-center font-semibold"
                        // name={`items[${index}].total`}
                        // value={formik?.values?.items[index]?.total}
                        // onChange={formik.handleChange}
                      >
                        {!isNaN(formik?.values?.items[index]?.rate * formik?.values?.items[index]?.quantity)
                          ? (formik?.values?.items[index]?.rate * formik?.values?.items[index]?.quantity).toFixed(2)
                          : "0.00"}
                      </td>
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
                        name="discount"
                        required
                        value={formik?.values?.discount}
                        onChange={formik?.handleChange}
                      />
                      {/* {formik.errors.discount && formik.touched.discount ? <div className="text-red-600">{formik.errors.discount}</div> : null} */}
                    </td>
                  </tr>

                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <td colSpan="6" className="py-3 px-6 text-right font-bold">
                      Grand Total
                    </td>
                    <td className="py-3 px-6 text-right font-bold">AED {formik?.values?.grandTotal?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ServicesButton;
