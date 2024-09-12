import { useState } from "react";
import { message } from "antd";
import "./Login.css"
import { Link } from "react-router-dom";
import { SignInInterface } from "../../../interfaces/ISignIn";
import { GetOwnerById, OwnerSignIn } from "../../../services/http";

function Login() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [messageApiLogin, contextHolderLogin] = message.useMessage();

	async function onFinish(e: any) {
		e.preventDefault();
		const data: SignInInterface = {
			Email: email,
			Password: password
		}
		let resSignin = await OwnerSignIn(data);
		if (resSignin) {
			messageApiLogin.success("Sign-in successful");
			localStorage.setItem("isLogin", "true");
			localStorage.setItem("token_type", resSignin.token_type);
			localStorage.setItem("token", resSignin.token);
			localStorage.setItem("id", resSignin.id);

            let resGetCustomer = await GetOwnerById(resSignin.id)

            localStorage.setItem("firstName", resGetCustomer.FirstName);
			localStorage.setItem("lastName", resGetCustomer.LastName);
            localStorage.setItem("profilePath", resGetCustomer.ProfilePath);

			setTimeout(() => {
				location.href = "/";
			}, 2000);
		}
		else {
			messageApiLogin.error("Email or Password is Incorrect");
		}
	}

	return (
		<div className="login-container">
			{contextHolderLogin}
			<div className="form-container">
				<form onSubmit={onFinish} className="login-form">
					<span className="title">Log<span>In</span></span>
					<div className="email-box input-box">
						<label className="email-text text">Email</label>
						<input
							type="email"
							className="email-input in-box"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="password-box input-box">
						<label className="password-text text">Password</label>
						<input
							type="password"
							className="password-input in-box"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="btn-box input-box">
						<input type="submit" className="submit-btn btn" value={"Submit"} />
						<button className="register-btn btn">Register</button>
					</div>
				</form>
                <Link className="back" to='/'>Back To Home</Link>
			</div>
		</div>
	);
}

export default Login;
