import React, { useState } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";

const DeliveryAddressForm = ({ address = {}, onAddressChange }) => {
    // FIXED: Initialize form state from props and manage local state
    const [formData, setFormData] = useState(address || {
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: '',
    });

    const [errors, setErrors] = useState({});

    // Update local state when input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        // FIXED: Update parent component state in real-time
        if (onAddressChange) {
            onAddressChange(newData);
        }
    };

    // FIXED: Add form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.streetAddress?.trim()) newErrors.streetAddress = 'Address is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        if (!formData.state?.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode?.trim()) newErrors.zipCode = 'Zip code is required';
        if (!formData.mobile?.trim()) newErrors.mobile = 'Phone number is required';
        // FIXED: Basic phone validation
        if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
            newErrors.mobile = 'Please enter a valid 10-digit phone number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // FIXED: Validate before submission
        if (!validateForm()) {
            alert('Please fill all required fields correctly');
            return;
        }

        // Address is already saved in parent state via onAddressChange
        console.log("Address saved:", formData);
    };

    return (
        <div>
            <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                    <Box className="border rounded-s-md shadow-md p-5">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        autoComplete="given-name"
                                        value={formData.firstName || ''}
                                        onChange={handleChange}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        autoComplete="family-name"
                                        value={formData.lastName || ''}
                                        onChange={handleChange}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="streetAddress"
                                        name="streetAddress"
                                        label="Address"
                                        fullWidth
                                        autoComplete="shipping address-line1"
                                        multiline
                                        rows={4}
                                        value={formData.streetAddress || ''}
                                        onChange={handleChange}
                                        error={!!errors.streetAddress}
                                        helperText={errors.streetAddress}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="shipping address-level2"
                                        value={formData.city || ''}
                                        onChange={handleChange}
                                        error={!!errors.city}
                                        helperText={errors.city}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="state"
                                        name="state"
                                        label="State/Province/Region"
                                        fullWidth
                                        value={formData.state || ''}
                                        onChange={handleChange}
                                        error={!!errors.state}
                                        helperText={errors.state}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="zipCode"
                                        name="zipCode"
                                        label="Zip/Postal Code"
                                        fullWidth
                                        autoComplete="shipping postal-code"
                                        value={formData.zipCode || ''}
                                        onChange={handleChange}
                                        error={!!errors.zipCode}
                                        helperText={errors.zipCode}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="mobile"
                                        name="mobile"
                                        label="Phone Number"
                                        fullWidth
                                        autoComplete="tel"
                                        value={formData.mobile || ''}
                                        onChange={handleChange}
                                        error={!!errors.mobile}
                                        helperText={errors.mobile}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        sx={{ py: 1.5, mt: 2, bgcolor: "RGB(145 85 253)" }}
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                    >
                                        Deliver Here
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default DeliveryAddressForm;