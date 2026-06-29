function TrackOrder() {
  const orderProgress = ["Placed", "Confirmed", "Packed", "In Transit", "Delivered"];
  const currentStep = 2;

  return (
    <div className="page-wrapper">
      <h1>Track Order</h1>
      <div className="progress-tracker">
        {orderProgress.map((step, index) => (
          <div key={index} className={`step ${index <= currentStep ? "active" : ""}`}>
            <div className="step-dot">{index + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Order #12345</h2>
        <p>Status: In Transit</p>
        <p>Expected Delivery: Tomorrow, 2-4 PM</p>
      </div>
    </div>
  );
}

export default TrackOrder;
