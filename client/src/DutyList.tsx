import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Table, Space } from 'antd';
const { Column } = Table;

interface Duty {
  id: string;
  name: string;
}

function DutyList() {
  const [addFormRef] = Form.useForm();
  const [updateFormRef] = Form.useForm();
  const [duties, setDuties] = useState<Duty[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);

  useEffect(() => {
    fetchDuties();
  }, []);

  const fetchDuties = async () => {
    try {
      const response = await fetch('/duty');
      const data = await response.json()
      setDuties(data);
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

        setDuties([...duties, newDuty]);
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

  const updateTodo = async (values: { name: string }) => {
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
        console.log('Updated todo:', updatedDuty);

        setDuties(duties.map((duty) => ((duty.id === selectedDuty!.id) ? updatedDuty : duty)));
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
        setDuties(duties.filter((todo) => todo.id !== id));
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
      <Button type="primary" onClick={openAddModal}>
        Add Duty
      </Button>

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
          title={`Update Todo ID [${selectedDuty.id}]`}
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
          <Form onFinish={updateTodo} form={updateFormRef}>
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
        title={`Delete Todo ID [${selectedDuty.id}]`}
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

      <Table dataSource={duties}>
        <Column title="ID" dataIndex="id" key="id"/>
        <Column title="Name" dataIndex="name" key="name"/>
        <Column title="Action" key="action" render={(_: any, todo: Duty) => (
        <Space size="middle">
          <a onClick={() => openUpdateModal(todo)}>Edit</a>
          <a onClick={() => openDeleteModal(todo)}>Delete</a>
        </Space>
      )}/>
      </Table>
    </div>
  );
};

export default DutyList;