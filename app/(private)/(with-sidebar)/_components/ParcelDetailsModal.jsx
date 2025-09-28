import { Modal, Descriptions } from "antd";
import dayjs from "dayjs";

export function ParcelDetailsModal({ visible, onClose, pathaoOrder }) {
  return (
    <Modal
      title="Parcel Details"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Consignment ID">
          {pathaoOrder?.consignment_id}
        </Descriptions.Item>
        <Descriptions.Item label="Merchant Order ID">
          {pathaoOrder?.merchant_order_id}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Name">
          {pathaoOrder?.recipient_name}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Phone">
          {pathaoOrder?.recipient_phone}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Address">
          {pathaoOrder?.recipient_address}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Type">
          {pathaoOrder?.delivery_type}
        </Descriptions.Item>
        <Descriptions.Item label="Item Type">
          {pathaoOrder?.item_type}
        </Descriptions.Item>
        <Descriptions.Item label="Item Quantity">
          {pathaoOrder?.item_quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Item Weight">
          {pathaoOrder?.item_weight}
        </Descriptions.Item>
        <Descriptions.Item label="Item Description">
          {pathaoOrder?.item_description}
        </Descriptions.Item>
        <Descriptions.Item label="Amount to Collect">
          {pathaoOrder?.amount_to_collect} Tk
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Fee">
          {pathaoOrder?.delivery_fee} Tk
        </Descriptions.Item>
        <Descriptions.Item label="Order Status">
          {pathaoOrder?.order_status}
        </Descriptions.Item>
        <Descriptions.Item label="Pathao Status">
          {pathaoOrder?.pathao_status}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dayjs(pathaoOrder?.created_at).format("MMM DD, YYYY hh:mm A")}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
