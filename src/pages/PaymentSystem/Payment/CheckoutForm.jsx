import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Swal from "sweetalert2";
import auth from "../../../Auth/Firebase/Firebase.init";
import Loading from "../../../components/Loading/Loading";
import { BASE_API } from "../../../config";

const CheckoutForm = ({ paymentDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [U, isLoading] = useAuthState(auth);
  

  const { price } = paymentDetails;

  useEffect(() => {
    fetch(`${BASE_API}/create-payment-intent`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      });
  }, [price]);

  if(isLoading){
    return <Loading />
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }
    // err handling for payment
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
   
    setCardError(error?.message || "");
    setSuccess("");

    // confirm card payment
    const { paymentIntent, error: intentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "Getting Premium Membership",
          },
        },
      });
 

    if (intentError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "error",
        title: intentError?.message,
      });
    } else {
      Swal.fire({
        title: "Congrats 🎉",
        text: "Pay successful",
        showCloseButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        icon: "success",
        width: "30em",
        footer: `Transaction Id: ${paymentIntent.id}`,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          className="btn btn-primary w-full my-3"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Make a Payment{" "}
          <span>
            <i class="ri-bank-card-fill text-lg font-medium ml-2"></i>
          </span>
        </button>
      </form>
      {cardError && (
        <p className="text-red-500 text-sm text-center">{cardError}</p>
      )}
      {success && (
        <div>
          <p className="text-green-500 text-sm text-center">{success}</p>
          <p className="text-green-500 text-sm text-center font-bold">
            Your Transaction Id:{" "}
            <span className="text-black opacity-50">{transactionId}</span>{" "}
          </p>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
