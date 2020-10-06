import React, { Component } from "react";
import "./Header.css";
import { withRouter } from "react-router-dom";
import Fastfood from "@material-ui/icons/Fastfood";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: "0px", textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      value: 0,
      loginContactNumberRequired: "dispNone",
      loginContactNumber: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstNameRequired: "dispNone",
      firstName: "",
      lastName: "",
      emailRequired: "dispNone",
      email: "",
      emailError: "",
      signupPasswordRequired: "dispNone",
      signupPassword: "",
      signupPasswordError: "",
      signupContactNumberRequired: "dispNone",
      signupContactNumber: "",
      signupContactNumberError: "",
      signupSuccess: false,
      snackBarOpen: false,
      snackBarMessage: "",
    };
  }

  openModalHandler = () => {
    this.setState({
      modalIsOpen: true,
      value: 0,
    });
  };

  closeModalHandler = () => {
    this.setState({
      modalIsOpen: false,
      value: 0,
      loginContactNumberRequired: "dispNone",
      loginContactNumber: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstNameRequired: "dispNone",
      firstName: "",
      lastName: "",
      emailRequired: "dispNone",
      email: "",
      emailError: "",
      signupPasswordRequired: "dispNone",
      signupPassword: "",
      signupPasswordError: "",
      signupContactNumberRequired: "dispNone",
      signupContactNumber: "",
      signupContactNumberError: "",
    });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  loginContactNumberChangeHandler = (e) => {
    this.setState({ loginContactNumber: e.target.value });
  };

  loginPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  signUpClickHandler = () => {
    this.state.firstName === ""
      ? this.setState({ firstNameRequired: "dispBlock" })
      : this.setState({ firstNameRequired: "dispNone" });
    this.state.email === ""
      ? this.setState({ emailRequired: "dispBlock" })
      : this.setState({ emailRequired: "dispNone" });
    this.state.signupPassword === ""
      ? this.setState({ signupPasswordRequired: "dispBlock" })
      : this.setState({ signupPasswordRequired: "dispNone" });
    this.state.signupContactNumber === ""
      ? this.setState({ signupContactNumberRequired: "dispBlock" })
      : this.setState({ signupContactNumberRequired: "dispNone" });

    //email validation
    if (this.state.email === "") {
      this.setState({
        emailRequired: "dispBlock",
        emailError: "required",
      });
    } else if (
      this.state.email
        .toString()
        .match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
    ) {
      this.setState({ emailRequired: "dispBlock" });
      this.setState({ emailError: "Invalid Email" });
    } else {
      this.setState({ emailRequired: "dispNone" });
      this.setState({ emailError: "" });
    }

    //password validation
    if (this.state.signupPassword === "") {
      this.setState({ signupPasswordRequired: "dispBlock" });
      this.setState({ signupPasswordError: "required" });
    } else if (
      this.state.signupPassword
        .toString()
        .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,32}$/i) === null
    ) {
      this.setState({ signupPasswordRequired: "dispBlock" });
      this.setState({
        signupPasswordError:
          "Password must contain at least one capital letter, one small letter, one number, and one special character",
      });
    } else {
      this.setState({ signupPasswordRequired: "dispNone" });
      this.setState({ signupPasswordError: "" });
    }

    //contact number validation
    if (this.state.signupContactNumber === "") {
      this.setState({ signupContactNumberRequired: "dispBlock" });
      this.setState({ signupContactNumberError: "required" });
      return;
    } else if (
      this.state.signupContactNumber.toString().match(/^(?=.*\d).{10,10}$/i) ===
      null
    ) {
      this.setState({ signupContactNumberRequired: "dispBlock" });
      this.setState({
        signupContactNumberError:
          "Contact No. must contain only numbers and must be 10 digits long",
      });
    } else {
      this.setState({ signupContactNumberRequired: "dispNone" });
      this.setState({ signupContactNumberError: "" });
    }

    if (
      this.state.email === "" ||
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.signupContactNumber === "" ||
      this.state.signupPassword === ""
    ) {
      return;
    }

    //xhr request for signup

    let dataSignup = JSON.stringify({
      contact_number: this.state.registerContactNumber,
      email_address: this.state.email,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      password: this.state.registerPassword,
    });

    let xhrSignup = new XMLHttpRequest();
    let that = this;
    xhrSignup.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (xhrSignup.status === 200 || xhrSignup.status === 201) {
          that.setState({
            signupSuccess: true,
          });
          that.snackBarHandler("Registered successfully! Please login now!");
          that.openModalHandler();
        } else {
          that.setState({ registerContactNumberRequired: "dispBlock" });
          that.setState({
            registerContactNumberError: JSON.parse(this.responseText).message,
          });
        }
      }
    });

    xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.send(dataSignup);
  };

  firstNameChangeHandler = (e) => {
    this.setState({ firstName: e.target.value });
  };

  lastNameChangeHandler = (e) => {
    this.setState({ lastName: e.target.value });
  };

  emailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  registerPasswordChangeHandler = (e) => {
    this.setState({ registerPassword: e.target.value });
  };

  registerContactNumberChangeHandler = (e) => {
    this.setState({ registerContactNumber: e.target.value });
  };

  snackBarHandler = (message) => {
    // if any snackbar open already close that
    this.setState({ snackBarOpen: false });
    // updating component state snackbar message
    this.setState({ snackBarMessage: message });
    // Show snackbar
    this.setState({ snackBarOpen: true });
  };

  render() {
    return (
      <div>
        <header className="app-header">
          <div className="flex-container-header">
            <div className="app-logo">
              <Fastfood style={{ fontSize: "35px", color: "white" }} />
            </div>
            {this.props.homeOptions === "true" ? (
              <div className="app-search">
                <Typography variant="h6">
                  <Input
                    type="text"
                    placeholder="Search by Restaurant Name"
                    inputProps={{ "aria-label": "description" }}
                    style={{ color: "grey", width: 280 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search style={{ color: "white" }} />
                      </InputAdornment>
                    }
                  />
                </Typography>
              </div>
            ) : (
              ""
            )}
            <div className="app-login">
              <Button
                variant="contained"
                color="default"
                onClick={this.openModalHandler}
              >
                <AccountCircle style={{ marginRight: 4 }} />
                LOGIN
              </Button>
            </div>
          </div>
        </header>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeModalHandler}
          style={customStyles}
        >
          <Tabs
            value={this.state.value}
            onChange={this.tabChangeHandler}
            className="tabs"
          >
            <Tab label="LOGIN" />
            <Tab label="SIGNUP" />
          </Tabs>
          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="loginContactNumber">
                  Contact No.
                </InputLabel>
                <Input
                  id="loginContactNumber"
                  type="number"
                  username={this.state.loginContactNumber}
                  onChange={this.loginContactNumberChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText
                  className={this.state.loginContactNumberRequired}
                >
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                <Input
                  id="loginPassword"
                  type="password"
                  loginpassword={this.state.loginPassword}
                  onChange={this.loginPasswordChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText className={this.state.loginPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              {this.state.loggedIn === true && (
                <FormControl>
                  <span className="successText">Login Successful!</span>
                </FormControl>
              )}
              <br />
              <br />
              <Button variant="contained" color="primary">
                LOGIN
              </Button>
            </TabContainer>
          )}

          {this.state.value === 1 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="firstName">First Name</InputLabel>
                <Input
                  id="firstName"
                  type="text"
                  firstname={this.state.firstName}
                  onChange={this.firstNameChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText className={this.state.firstNameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl>
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <Input
                  id="lastName"
                  type="text"
                  lastname={this.state.lastName}
                  onChange={this.lastNameChangeHandler}
                  className="loginmodal-input"
                />
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="text"
                  email={this.state.email}
                  onChange={this.emailChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">{this.state.emailError}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                <Input
                  id="registerPassword"
                  type="password"
                  registerpassword={this.state.registerPassword}
                  onChange={this.registerPasswordChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText className={this.state.registerPasswordRequired}>
                  <div className="custom-formhelper">
                    {this.state.registerPasswordError}
                  </div>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="registerContactNumber">
                  Contact No.
                </InputLabel>
                <Input
                  id="registerContactNumber"
                  type="number"
                  mobile={this.state.registerContactNumber}
                  onChange={this.registerContactNumberChangeHandler}
                  className="loginmodal-input"
                />
                <FormHelperText
                  className={this.state.registerContactNumberRequired}
                >
                  <div className="custom-formhelper">
                    {this.state.registerContactNumberError}
                  </div>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              {this.state.registrationSuccess === true && (
                <FormControl>
                  <span className="successText">
                    Registration Successful. Please Login!
                  </span>
                </FormControl>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.signUpClickHandler}
              >
                SIGNUP
              </Button>
            </TabContainer>
          )}
        </Modal>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackBarOpen: false })}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.setState({ snackBarOpen: false })}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withRouter(Header);
