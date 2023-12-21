import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Table,
  Space,
  FloatButton,
  Layout,
} from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { Duty } from './types';
const { Column } = Table;
const { Header, Content } = Layout;

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

function DutyList() {
  const [addFormRef] = Form.useForm();
  const [updateFormRef] = Form.useForm();
  const [dutys, setDutys] = useState<Duty[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);

  useEffect(() => {
    fetchDutys();
  }, []);

  const fetchDutys = async () => {
    try {
      const response = await fetch('/duty');
      const data = await response.json()
      setDutys(data);
      console.log('Fetched duties:', data);
    } catch (error) {
      console.error('Error fetching duties:', error);
    }
  };

  const openAddModal = () => {
    addFormRef.resetFields();
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    addFormRef.resetFields();
    setAddModalVisible(false);
  };

  const addDuty = async (values: { id: string, name: string }) => {
    try {
      const response = await fetch('/duty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const newDuty: Duty = await response.json();
        console.log('Added duty:', newDuty);

        setDutys([...dutys, newDuty]);
        closeAddModal();

        message.success('Duty added successfully');
      } else {
        throw new Error('Failed to add duty');
      }
    } catch (error) {
      console.error('Error adding duty:', error);
      message.error('Failed to add duty');
    }
  };

  const openUpdateModal = (duty: Duty) => {
    updateFormRef.setFieldsValue({ name: duty.name });
    setSelectedDuty(duty);
    setUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setSelectedDuty(null);
    setUpdateModalVisible(false);
  };

  const updateDuty = async (values: { name: string }) => {
    if (!selectedDuty) return;

    try {
      const response = await fetch(`/duty/${selectedDuty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: values.name }),
      });

      if (response.ok) {
        const updatedDuty: Duty = { ...selectedDuty, name: values.name };
        console.log('Updated duty:', updatedDuty);

        setDutys(dutys.map((duty) => ((duty.id === selectedDuty!.id) ? updatedDuty : duty)));
        closeUpdateModal();
        message.success('Duty updated successfully');
      } else {
        throw new Error('Failed to update duty');
      }
    } catch (error) {
      console.error('Error updating duty:', error);
      message.error('Failed to update duty');
    }
  };

  const openDeleteModal = (duty: Duty) => {
    setSelectedDuty(duty);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedDuty(null);
    setDeleteModalVisible(false);
  };

  const deleteDuty = async (id: string) => {
    try {
      const response = await fetch(`/duty/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDutys(dutys.filter((duty) => duty.id !== id));
        closeDeleteModal();
        message.success('Duty deleted successfully');
      } else {
        throw new Error('Failed to delete duty');
      }
    } catch (error) {
      console.error('Error deleting duty:', error);
      message.error('Failed to delete duty');
    }
  };

  return (
    <div>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>Duty List</Header>
        <Content>

          <FloatButton icon={<PlusCircleTwoTone />}
            onClick={openAddModal}
          />
          <Modal
            title="Add Duty"
            open={addModalVisible}
            onCancel={closeAddModal}
            footer={[
              <Button key="cancel" onClick={closeAddModal}>
                Cancel
              </Button>,
              <Button key="add" type="primary" onClick={() => addFormRef.submit()}
              >
                Add
              </Button>,
            ]}
          >
            <Form onFinish={addDuty} form={addFormRef}>
              <Form.Item label="ID" name="id"
                rules={[
                  { required: true, message: 'Please enter duty id' }
                ]}>
                <Input placeholder="id" />
              </Form.Item>
              <Form.Item label="Name" name="name"
                rules={[
                  { required: true, message: 'Please enter duty name' }
                ]}>
                <Input placeholder="name" />
              </Form.Item>
            </Form>
          </Modal>

          {selectedDuty && (
            <Modal
              title={`Edit Duty ID [${selectedDuty.id}]`}
              open={updateModalVisible}
              onCancel={closeUpdateModal}
              footer={[
                <Button key="cancel" onClick={closeUpdateModal}>
                  Cancel
                </Button>,
                <Button key="update" type="primary" onClick={() => updateFormRef.submit()}>
                  Update
                </Button>,
              ]}
            >
              <Form onFinish={updateDuty} form={updateFormRef}>
                <Form.Item label="Name" name="name"
                  rules={[
                    { required: true, message: 'Please enter new duty name' }
                  ]}
                >
                  <Input placeholder="name" />
                </Form.Item>
              </Form>
            </Modal>
          )}

          {selectedDuty && (
            <Modal
              title={`Delete Duty ID [${selectedDuty.id}]`}
              open={deleteModalVisible}
              onCancel={closeDeleteModal}
              footer={[
                <Button key="cancel" onClick={closeDeleteModal}>
                  Cancel
                </Button>,
                <Button key="delete" type="primary" danger onClick={() => deleteDuty(selectedDuty.id)}>
                  Delete
                </Button>,
              ]}
            >
              <p>Are you sure you want to delete "{selectedDuty.name}"?</p>
            </Modal>
          )}

          <Table dataSource={dutys}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Action" key="action" render={(_: any, duty: Duty) => (
              <Space size="middle">
                <a onClick={() => openUpdateModal(duty)}>Edit</a>
                <a onClick={() => openDeleteModal(duty)}>Delete</a>
              </Space>
            )} />
          </Table>
        </Content>
      </Layout>
    </div>
  );
};

export default DutyList;