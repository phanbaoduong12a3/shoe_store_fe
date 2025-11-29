import { useState } from "react";
import { Modal, Form, Input, Switch, Upload, InputNumber, Select, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useAppDispatch } from "@/stores";
import { createCategoryAction } from "@/stores/category";

interface CreateCategoryModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const CreateCategoryModal = ({ open, onCancel, onSuccess }: CreateCategoryModalProps) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const imageFile = fileList[0]?.originFileObj;

            dispatch(
                createCategoryAction({
                    name: values.name,
                    slug: values.slug,
                    description: values.description,
                    image: imageFile,
                    parentId: values.parentId,
                    isActive: values.isActive ?? true,
                    displayOrder: values.displayOrder,
                    onSuccess: (data) => {
                        message.success({
                            content: data.data.message || "Tạo danh mục thành công!",
                            duration: 2,
                        });
                        form.resetFields();
                        setFileList([]);
                        setLoading(false);
                        onSuccess();
                    },
                    onError: (error) => {
                        message.error({
                            content: error?.response?.data?.message || "Tạo danh mục thất bại!",
                            duration: 3,
                        });
                        setLoading(false);
                    },
                })
            );
        } catch (error) {
            console.error("Validation failed:", error);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    return (
        <Modal
            title="Thêm danh mục mới"
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={600}
            okText="Tạo mới"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ isActive: true, displayOrder: 0 }}
            >
                <Form.Item
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
                >
                    <Input placeholder="Nhập tên danh mục" />
                </Form.Item>

                <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
                >
                    <Input placeholder="Nhập slug (vd: giay-the-thao)" />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} placeholder="Nhập mô tả danh mục" />
                </Form.Item>

                <Form.Item label="Hình ảnh" name="image">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        {fileList.length === 0 && (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item label="Danh mục cha" name="parentId">
                    <Select placeholder="Chọn danh mục cha (nếu có)" allowClear>
                        {/* TODO: Load parent categories */}
                    </Select>
                </Form.Item>

                <Form.Item label="Thứ tự hiển thị" name="displayOrder">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCategoryModal;
