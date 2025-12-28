# Conquistador: Decentralized Escrow and Reputation Management

**Conquistador** is a smart contract built on the Stacks blockchain to facilitate secure transactions and establish trust in decentralized platforms. It combines escrow services with a reputation management system, enabling transparent, secure, and trustful interactions between users.

## Features

### 1. **Decentralized Escrow**
- Allows users to create and manage escrow transactions securely.
- Funds are held in the contract until the sender explicitly releases them to the recipient.

### 2. **Reputation Management**
- Tracks and rewards users based on transaction history.
- Ensures trustworthiness and accountability by adding reputation points for successful transactions.

### 3. **Transparent Record Keeping**
- Stores transaction details, including sender, recipient, amount, status, and reputation points.
- Allows users to view their reputation and past transaction details.

---

## Core Functionalities

### 1. **Create Transaction**
- **Function**: `create-transaction (recipient principal) (amount uint)`
- **Description**: Creates a new escrow transaction with a unique ID. The sender deposits funds into the contract, which are held securely until released.
- **Validation**:
  - The recipient must not be the sender or contract owner.
  - The transaction amount must be greater than zero.

---

### 2. **Release Funds**
- **Function**: `release-funds (transaction-id uint)`
- **Description**: Allows the sender to release funds to the recipient.
- **Validation**:
  - Ensures the transaction ID is valid.
  - Verifies that the sender is authorized to release funds.
  - Updates the transaction status to "COMPLETED."

---

### 3. **Add Reputation Points**
- **Function**: `add-reputation-points (transaction-id uint) (points uint)`
- **Description**: Adds reputation points to the sender of a transaction upon successful completion.
- **Validation**:
  - Only the recipient of the transaction can add points.
  - Reputation points must be greater than zero.

---

### 4. **Get User Reputation**
- **Function**: `get-user-reputation (user principal)`
- **Description**: Fetches the total reputation points and transaction count for a specific user.
- **Returns**: `{ total-points: uint, total-transactions: uint }`

---

### 5. **Get Transaction Details**
- **Function**: `get-transaction-details (transaction-id uint)`
- **Description**: Fetches details of a specific transaction.
- **Returns**: Transaction data, including sender, recipient, amount, status, creation timestamp, and reputation points.

---

## Data Structures

### **1. Transaction Map**
Stores details of each transaction, indexed by a unique transaction ID.
- **Key**: `{ id: uint }`
- **Value**:
  ```clarity
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    status: (string-ascii 20),
    created-at: uint,
    reputation-points: uint
  }
  ```

### **2. User Reputation Map**
Tracks the reputation data for each user.
- **Key**: `{ user: principal }`
- **Value**:
  ```clarity
  {
    total-points: uint,
    total-transactions: uint
  }
  ```

---

## Constants

- **`CONTRACT-OWNER`**: Address of the contract deployer.
- **Error Codes**:
  - `ERR-UNAUTHORIZED` (`u1`): Unauthorized action.
  - `ERR-INSUFFICIENT-FUNDS` (`u2`): Insufficient funds for transaction.
  - `ERR-INVALID-RECIPIENT` (`u3`): Invalid recipient address.
  - `ERR-TRANSACTION-NOT-FOUND` (`u4`): Transaction not found.
  - `ERR-INVALID-POINTS` (`u5`): Invalid reputation points.
  - `ERR-INVALID-TRANSACTION-ID` (`u6`): Invalid transaction ID.

---

## Usage

### Prerequisites
- Deployed on the Stacks blockchain.
- Stacks-enabled wallet for creating and managing transactions.

### Deployment
Deploy the contract using a Stacks-compatible development environment (e.g., Clarinet or the Stacks CLI).

---

## Examples

### **Creating a Transaction**
```clarity
(create-transaction 
  'SP1234567890RECIPIENT
  u1000
)
```

### **Releasing Funds**
```clarity
(release-funds u1)
```

### **Adding Reputation Points**
```clarity
(add-reputation-points u1 u5)
```

### **Getting User Reputation**
```clarity
(get-user-reputation 'SP1234567890USER)
```

### **Fetching Transaction Details**
```clarity
(get-transaction-details u1)
```

---

## License
This project is open-sourced under the MIT License.