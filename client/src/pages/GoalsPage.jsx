import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { createGoalRequest } from '../api/goals';
import Swal from 'sweetalert2'
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';

function GoalsPage() {
    const { isAuthenticated, usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const formik = useFormik({
        initialValues: {
            amount: '',
            category: '',
            startDate: '',
            endDate: '',
            submit: null
        },
        validationSchema: Yup.object({
            amount: Yup
                .number()
                .required('Amount is required'),
            category: Yup
                .string()
                .max(255)
                .required('Category is required'),
            startDate: Yup
                .date()
                .required('Start Date is required'),
            endDate: Yup
                .date()
                .required('End Date is required'),
        }),

        onSubmit: async (values, helpers) => {
            try {

                const goalData = {
                    amount: values.amount,
                    category: values.category,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    company: usuario.company
                }
                await createGoalRequest(goalData)
                Swal.fire({
                    icon: 'success',
                    text: 'Registered goal',
                    confirmButtonColor: '#8F3C8A',
                }).then(() => {
                    window.location.replace('/dashboard');
                });
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    return (
        <div className={`flex  h-[80vh] items-center justify-right justify-center`}>
            <div className={` max-w-md w-full  rounded-md p-8 bg-[#fff] `} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(219, 207, 228, 0.7)' }}>
                <h1 style={{marginBottom: '15px'}}> <LocalGroceryStoreRoundedIcon sx={{ fontSize: 45 }}/> Add Goal</h1>
                <div className="">
                    <form
                        noValidate
                        onSubmit={formik.handleSubmit}
                    >
                        <Stack spacing={3}>
                            <TextField
                                color="secondary"
                                error={!!(formik.touched.amount && formik.errors.amount)}
                                fullWidth
                                label="Amount"
                                name="amount"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                            />
                            <TextField
                                color="secondary"
                                error={!!(formik.touched.category && formik.errors.category)}
                                fullWidth
                                label="Category"
                                name="category"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.category}
                            />
                            <div className="font-bold">Goal start date</div>
                            <TextField
                                color="secondary"
                                error={!!(formik.touched.startDate && formik.errors.startDate)}
                                fullWidth
                                helperText={formik.touched.startDate && formik.errors.startDate}
                                name="startDate"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type='date'
                                value={formik.values.startDate}
                            />
                            <div className="font-bold">Goal end date</div>
                            <TextField
                                color="secondary"
                                error={!!(formik.touched.endDate && formik.errors.endDate)}
                                fullWidth
                                helperText={formik.touched.endDate && formik.errors.endDate}
                                name="endDate"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type='date'
                                value={formik.values.endDate}
                            />
                        </Stack>

                        {formik.errors.submit && (
                            <Typography
                                color="error"
                                sx={{ mt: 3 }}
                                variant="body2"
                            >
                                {formik.errors.submit}
                            </Typography>
                        )}
                        <div>
                            <Button
                                fullWidth
                                size="large"
                                sx={{
                                    mt: 3
                                }}                                
                                
                                color="secondary"
                                type="submit"
                                variant="contained"
                            >
                                Add Goal
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default GoalsPage
