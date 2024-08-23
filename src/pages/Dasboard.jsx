import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHands,
  faWallet,
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [formData, setFormData] = useState({
    // senderAccountNumber: "",
    receiverAccountNumber: "",
    amount: "",
    feeRate: "",
  });

  const [depositData, setDepositData] = useState({
    amount: "",
    accountNumber: "",
  });

  const [withdrawData, setWithdrawData] = useState({
    accountNumber: "",
    amount: "",
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const userResponse = await axios.get(
            `https://backend-bora.onrender.com/user/${userId}`,
            { withCredentials: true }
          );

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
      case "withdraw":
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { receiverAccountNumber, amount, feeRate } = formData;

    if (!receiverAccountNumber || !amount || !feeRate) {
      toast.error("Please fill out all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const senderAccountNumber = user.accountNumber;

      const response = await axios.post(
        "https://backend-bora.onrender.com/transaction/transaction",
        {
          senderAccountNumber,
          receiverAccountNumber,
          amount: Number(amount),
          feeRate: Number(feeRate),
        },
        { withCredentials: true }
      );

      toast.success("Transaction created successfully");
      handleCloseModal("send");

      const userResponse = await axios.get(
        `https://backend-bora.onrender.com/user/${userId}`,
        { withCredentials: true }
      );

      setUser(userResponse.data.data);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { amount } = depositData;
    const accountNumber = user.accountNumber;

    if (!amount) {
      toast.error("The amount is required");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "https://backend-bora.onrender.com/transaction/deposit",
        { amount, accountNumber },
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

      console.log("Updated user data:", userResponse.data.data);

      setUser(userResponse.data.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Withdraw
  const handleWithdraw = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");
    setIsSubmitting(true);

    const { amount } = withdrawData;
    const accountNumber = user.accountNumber;

    console.log("Withdraw data:", withdrawData);

    if (!amount || amount <= 0) {
      toast.error("The amount is required");
      setIsSubmitting(false);
      return;
    }

    if (!user || amount > user.balance) {
      toast.error("Insufficient balance");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "https://backend-bora.onrender.com/transaction/withdraw",
        { amount, accountNumber },
        { withCredentials: true }
      );
      toast.success("Withdrawal successful");
      setWithdrawData({ accountNumber: "", amount: "" });
      handleCloseModal("withdraw");

      // Refresh user data
      const userResponse = await axios.get(
        `https://backend-bora.onrender.com/user/${userId}`,
        { withCredentials: true }
      );

      setUser(userResponse.data.data);
    } catch (error) {
      console.error("Error withdraw:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      console.log("Resetting submitting state");
      setIsSubmitting(false);
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
          {/* User Info */}
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
                          WithDraw
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
                <ul>
                  {user.transactionHistory &&
                  user.transactionHistory.length > 0 ? (
                    user.transactionHistory.map((transaction) => (
                      <li key={transaction._id}>${transaction.amount}</li>
                    ))
                  ) : (
                    <p>No transactions found.</p>
                  )}
                </ul>
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    "Send"
                  )}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    "Deposit"
                  )}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Withdraw Modal */}
          <Modal
            show={showTransferModal}
            onHide={() => handleCloseModal("withdraw")}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-black">
                <FontAwesomeIcon icon={faArrowDown} className="me-2" /> Withdraw
                Funds
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleWithdraw}>
                <Form.Group controlId="amount" className="mb-3">
                  <Form.Label className="text-black">Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={withdrawData.amount}
                    onChange={(e) => handleInputChange(e, setWithdrawData)}
                    placeholder="Enter the amount to withdraw"
                    required
                  />
                </Form.Group>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    "Withdraw"
                  )}
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
