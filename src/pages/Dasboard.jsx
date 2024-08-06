import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./styles.css";
import HeaderLogout from "../components/Logout";

export default function Dashboard() {
  const userId = useSelector((state) => state.auth.userId);
  const transactionId = useSelector((state) => state.auth.transactionId);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [formData, setFormData] = useState({
    senderAccountNumber: "",
    receiverAccountNumber: "",
    amount: "",
    feeRate: "",
  });
  const [depositData, setDepositData] = useState({
    amount: "",
  });
  const [transferData, setTransferData] = useState({
    receiverAccountNumber: "",
    amount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (!userId) {
          throw new Error("No user ID found");
        }

        const userResponse = await axios.get(
          `https://backend-bora.onrender.com/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        setUser(userResponse.data.data);

        if (transactionId) {
          const transactionsResponse = await axios.get(
            `https://backend-bora.onrender.com/transaction/${transactionId}`,
            {
              withCredentials: true,
            }
          );

          setTransactions([transactionsResponse.data.data]);
        } else {
          toast.error("Transaction ID is not defined");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, transactionId]);

  const handleShowModal = (modal) => {
    if (modal === "send") setShowSendModal(true);
    if (modal === "deposit") setShowDepositModal(true);
    if (modal === "transfer") setShowTransferModal(true);
  };

  const handleCloseModal = (modal) => {
    if (modal === "send") setShowSendModal(false);
    if (modal === "deposit") setShowDepositModal(false);
    if (modal === "transfer") setShowTransferModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setDepositData({ ...depositData, [name]: value });
  };

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission logic here
      console.log("Send form submitted with data:", formData);
      await axios.post(
        "https://backend-bora.onrender.com/transaction/transaction",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Transaction created successfully");
      handleCloseModal("send");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      console.log("Deposit form submitted with data:", depositData);
      await axios.post(
        "https://backend-bora.onrender.com/transaction/transaction", // Ensure this endpoint is correct
        depositData,
        {
          withCredentials: true,
        }
      );
      toast.success("Deposit successful");
      handleCloseModal("deposit");
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Failed to deposit");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      console.log("Transfer form submitted with data:", transferData);
      await axios.post(
        "https://backend-bora.onrender.com/transaction/Transaction",
        transferData,
        {
          withCredentials: true,
        }
      );
      toast.success("Transfer successful");
      handleCloseModal("transfer");
    } catch (error) {
      console.error("Error transferring:", error);
      toast.error("Failed to transfer");
    }
  };

  return (
    <div className="dashboard-container">
      <HeaderLogout />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
          <span className="ms-2">Wait A Few Minutes......</span>
        </div>
      ) : user ? (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h1>
              Welcome, {user.name}!
              <FontAwesomeIcon icon={faHands} className="ms-2" />
            </h1>
            {/* Info User */}
            <div className="balance-section">
              <div className="row g-2">
                <div className="p-3 border bg-light">
                  Account Number:
                  <p>{user.accountNumber}</p>
                  Balance:
                  <p className="fs-3">${user.balance}</p>
                  <div className="row g-2">
                    <div className="col-6">
                      Public Rate:
                      <p className="fs-3">{user.public_rate}</p>
                    </div>
                    <div className="col-6">
                      Value: <p className="fs-3">{user.value}</p>
                    </div>
                  </div>
                  <div className="mx-auto">
                    <div
                      className="row g-2"
                      role="group"
                      aria-label="First group"
                    >
                      <div className="col-4 mx-auto">
                        <Button
                          onClick={() => handleShowModal("send")}
                          className="btn btn-primary"
                        >
                          Send
                        </Button>
                      </div>
                      <div className="col-4 mx-auto">
                        <Button
                          onClick={() => handleShowModal("deposit")}
                          className="btn btn-primary"
                        >
                          Deposit
                        </Button>
                      </div>
                      <div className="col-4 mx-auto">
                        <Button
                          onClick={() => handleShowModal("transfer")}
                          className="btn btn-primary"
                        >
                          Transfer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Transaction History */}
            <div className="row g-2">
              <div className="row g-2">
                <div className="col-6">
                  <p className="fw-bold">Transaction History</p>
                </div>
                <div className="col-6">
                  <a
                    href="/transactionDetail"
                    className="fw-bold text-decoration-none text-black"
                  >
                    See More
                  </a>
                </div>
              </div>
              <div className="transactions-section">
                {transactions.length > 0 ? (
                  <ul>
                    {transactions.map((transaction) => (
                      <li key={transaction._id}>
                        {new Date(transaction.createdAt).toLocaleDateString()} -
                        ${transaction.amount}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No transactions found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mx-auto">
          <h1>Unauthorized Access</h1>
          <p>Please log in to view this page.</p>
          <Button href="/login" className="btn btn-primary">
            Go to Login
          </Button>
        </div>
      )}
      {/* Send Modal */}
      <Modal show={showSendModal} onHide={() => handleCloseModal("send")}>
        <Modal.Header closeButton>
          <Modal.Title className="text-black">Send Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formSenderAccountNumber">
              <Form.Label className="text-black">
                Sender Account Number
              </Form.Label>
              <Form.Control
                type="text"
                name="senderAccountNumber"
                value={formData.senderAccountNumber}
                onChange={handleInputChange}
                placeholder="Enter sender account number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formReceiverAccountNumber">
              <Form.Label className="text-black">
                Receiver Account Number
              </Form.Label>
              <Form.Control
                type="text"
                name="receiverAccountNumber"
                value={formData.receiverAccountNumber}
                onChange={handleInputChange}
                placeholder="Enter receiver account number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label className="text-black">Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFeeRate">
              <Form.Label className="text-black">Fee Rate</Form.Label>
              <Form.Control
                type="number"
                name="feeRate"
                value={formData.feeRate}
                onChange={handleInputChange}
                placeholder="Enter fee rate"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Deposit Modal */}
      <Modal show={showDepositModal} onHide={() => handleCloseModal("deposit")}>
        <Modal.Header closeButton>
          <Modal.Title className="text-black">Deposit Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDeposit}>
            <Form.Group className="mb-3" controlId="formDepositAmount">
              <Form.Label className="text-black">Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={depositData.amount}
                onChange={handleDepositChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Deposit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Transfer Modal */}
      <Modal
        show={showTransferModal}
        onHide={() => handleCloseModal("transfer")}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-black">Transfer Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTransfer}>
            <Form.Group
              className="mb-3"
              controlId="formTransferReceiverAccountNumber"
            >
              <Form.Label className="text-black">
                Receiver Account Number
              </Form.Label>
              <Form.Control
                type="text"
                name="receiverAccountNumber"
                value={transferData.receiverAccountNumber}
                onChange={handleTransferChange}
                placeholder="Enter receiver account number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTransferAmount">
              <Form.Label className="text-black">Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleTransferChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Transfer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
