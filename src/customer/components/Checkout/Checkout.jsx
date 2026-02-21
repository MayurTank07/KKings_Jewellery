import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import DeliveryAddressForm from './DeliveryAddress';
import OrderSummary from './OrderSummary';
import Payment from '../Payment/Payment';

const steps = ['Login', 'Delivery Address', 'Order Summary', 'Payment'];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate(); // FIXED: Declare navigate before using it
  const { cartItems } = useCart(); // Get cart items to check if empty
  const querySearch = new URLSearchParams(location.search);
  
  // Convert URL string to number, default to 0 if null
  const step = parseInt(querySearch.get('step')) || 0;

  const [activeStep, setActiveStep] = React.useState(step);
  // Store delivery address for order
  const [deliveryAddress, setDeliveryAddress] = React.useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: '',
  });

  // FIXED: Check if cart is empty and prevent checkout
  React.useEffect(() => {
    if (cartItems.length === 0 && activeStep > 0) {
      alert('Your cart is empty. Please add items before checking out.');
      navigate('/cart');
    }
  }, [cartItems, activeStep, navigate]);

  // Sync state if URL changes
  React.useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const handleNext = () => {
    // FIXED: Validate delivery address before moving forward
    if (activeStep === 1) {
      if (!deliveryAddress.firstName || !deliveryAddress.lastName || !deliveryAddress.streetAddress || !deliveryAddress.mobile) {
        alert('Please fill all required fields');
        return;
      }
    }
    const next = activeStep + 1;
    setActiveStep(next);
    navigate(`?step=${next}`, { replace: true });
  };

  const handleBack = () => {
    const prev = activeStep - 1;
    setActiveStep(prev);
    navigate(`?step=${prev}`, { replace: true });
  };

  return (
    <div className='px-10 lg:px-20'>
      <Box sx={{ width: '100%' }}>
        {/* Pass activeStep (number) instead of step (string) */}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button 
                onClick={handleNext}
                disabled={cartItems.length === 0 && activeStep > 0}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>

            <div className='mt-10'>
              {/* FIXED: Pass delivery address state to forms */}
              {activeStep === 1 && (
                <DeliveryAddressForm 
                  address={deliveryAddress}
                  onAddressChange={setDeliveryAddress}
                />
              )}
              {activeStep === 2 && (
                <OrderSummary address={deliveryAddress} />
              )}
              {activeStep === 3 && (
                <Payment />
              )}
            </div>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
