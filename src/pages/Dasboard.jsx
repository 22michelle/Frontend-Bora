import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHands,
  faWallet,
  faFileInvoiceDollar,
  faArrowUp,
  faArrowDown,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./styles.css";
import HeaderLogout from "../components/Logout.jsx";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (!userId) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [userResponse] = await Promise.all([
            axios.get(`https://backend-bora.onrender.com/user/${userId}`, {
              withCredentials: true,
            }),
          ]);

          if (userResponse.data?.data) {
            setUser(userResponse.data.data);
            setTransactions(userResponse.data.data.transactionHistory || []);
          } else {
            throw new Error("User data not found");
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
    }
  }, [userId, navigate]);

  const handleShowModal = (modal) => {
    switch (modal) {
      case "send":
        setShowSendModal(true);
        break;
      case "deposit":
        setShowDepositModal(true);
        break;
      case "transfer":
        setShowTransferModal(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = (modal) => {
    switch (modal) {
      case "send":
        setShowSendModal(false);
        break;
      case "deposit":
        setShowDepositModal(false);
        break;
      case "transfer":
        setShowTransferModal(false);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e, stateSetter) => {
    const { name, value } = e.target;
    stateSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { senderAccountNumber, receiverAccountNumber, amount, feeRate } =
      formData;

    if (!senderAccountNumber || !receiverAccountNumber || !amount || !feeRate) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }

    try {
      await axios.post(
        "https://backend-bora.onrender.com/transaction/transaction",
        formData,
        { withCredentials: true }
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
    const { amount } = depositData;

    if (!amount) {
      toast.error("Amount is required");
      return;
    }

    try {
      await axios.post(
        "https://backend-bora.onrender.com/transaction/deposit",
        { amount },
        { withCredentials: true }
      );
      toast.success("Deposit successful");
      setDepositData({ amount: "" });
      handleCloseModal("deposit");

      // Refresh user data
      const userResponse = await axios.get(
        `https://backend-bora.onrender.com/user/${userId}`,
        { withCredentials: true }
      );
      setUser(userResponse.data.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const { receiverAccountNumber, amount } = transferData;

    if (!receiverAccountNumber || !amount || amount <= 0) {
      toast.error("Please fill out all fields with valid values.");
      return;
    }

    if (!user || amount > user.balance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      await axios.post(
        "https://backend-bora.onrender.com/transaction/transaction",
        transferData,
        { withCredentials: true }
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
        <div className="overlay">
          <div className="spinner-container">
            <span className="ms-2 text-light">Wait A Few Minutes...</span>
            <Spinner animation="border" variant="light" />
          </div>
        </div>
      ) : user ? (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h1>
              Welcome, {user.name}!
              <FontAwesomeIcon icon={faHands} className="ms-2" />
            </h1>
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
                  {/* Menu Buttons */}
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
                          <FontAwesomeIcon icon={faArrowUp} className="me-2" />
                          <br />
                          Send
                        </Button>
                      </div>
                      <div className="col-4 mx-auto">
                        <Button
                          onClick={() => handleShowModal("deposit")}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon={faWallet} className="me-2" />
                          <br />
                          Deposit
                        </Button>
                      </div>
                      <div className="col-4 mx-auto">
                        <Button
                          onClick={() => handleShowModal("transfer")}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="me-2"
                          />
                          <br />
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
                  <ul className="list-group">
                    {transactions.map((transaction) => (
                      <li key={transaction._id} className="list-group-item">
                        <p>
                          <strong>Sender:</strong> {transaction.senderName}
                        </p>
                        <p>
                          <strong>Receiver:</strong> {transaction.receiverName}
                        </p>
                        <p>
                          <strong>Amount:</strong> ${transaction.amount}
                        </p>
                        <p>
                          <strong>Fee Rate:</strong> {transaction.fee_rate}%
                        </p>
                        <p>
                          <strong>Initial Sender Balance:</strong> $
                          {transaction.initialSenderBalance}
                        </p>
                        <p>
                          <strong>Final Sender Balance:</strong> $
                          {transaction.finalSenderBalance}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No transactions available.</p>
                )}
              </div>
            </div>
          </div>
          {/* Modals Send */}
          <Modal show={showSendModal} onHide={() => handleCloseModal("send")}>
            <Modal.Header closeButton>
              <Modal.Title className="text-black">
                <FontAwesomeIcon icon={faArrowUp} className="me-2" />
                Send
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">
                    Sender Account Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter sender account number"
                    name="senderAccountNumber"
                    value={formData.senderAccountNumber}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">
                    Receiver Account Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter receiver account number"
                    name="receiverAccountNumber"
                    value={formData.receiverAccountNumber}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Fee Rate</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter fee rate"
                    name="feeRate"
                    value={formData.feeRate}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Modals Deposit */}
          <Modal
            show={showDepositModal}
            onHide={() => handleCloseModal("deposit")}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-black">
                <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                Deposit
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleDeposit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={depositData.amount}
                    onChange={(e) => handleInputChange(e, setDepositData)}
                    placeholder="Deposit amount"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Deposit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Modals Transfer */}
          <Modal
            show={showTransferModal}
            onHide={() => handleCloseModal("transfer")}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-black">
                <FontAwesomeIcon icon={faArrowDown} className="me-2" />
                Transfer
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleTransfer}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">
                    Receiver Account Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter receiver account number"
                    name="receiverAccountNumber"
                    value={transferData.receiverAccountNumber}
                    onChange={(e) => handleInputChange(e, setTransferData)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    value={transferData.amount}
                    onChange={(e) => handleInputChange(e, setTransferData)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Transfer
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}
