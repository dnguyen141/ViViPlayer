import React from "react";
import { Form, Input, InputNumber, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const Segment = ({ updateSegment, setUpdateSegment }) => {
  //console.log(updateSegment);
  const onFinish = (values) => {
    // console.log("Received values of form:", values);
    // console.log(values.users);
    localStorage.setItem("segmentSetting", JSON.stringify(values.users));
    setUpdateSegment(!updateSegment);
  };

  return (
    <div>
      <h2>Video Segmentieren</h2>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "text"]}
                    fieldKey={[fieldKey, "text"]}
                    rules={[
                      { required: true, message: "Missing name of chapter" },
                    ]}
                  >
                    <Input placeholder="Name of chapter" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "time"]}
                    fieldKey={[fieldKey, "time"]}
                    rules={[{ required: true, message: "Missing time" }]}
                  >
                    <InputNumber placeholder="Time (seconds)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Chapter
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Segment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Segment;
