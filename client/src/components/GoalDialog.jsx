import { Button, Dialog, Container, DialogTitle, IconButton, TextField, DialogContent, Stack, Typography } from "@mui/material";
import { useAuth } from '../context/AuthContext'
import { createGoalRequest } from '../api/goals';
import Swal from 'sweetalert2'
import CloseIcon from '@mui/icons-material/Close';
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';

const AddGoal = (props) => {

    const { usuario } = useAuth();

    const formik = useFormik({
        initialValues: {
            amount: '',
            startDate: props.lastCsvDate ? moment(props.lastCsvDate).subtract(30, 'days').format('YYYY-MM-DD') : '',
            endDate: props.lastCsvDate ? moment(props.lastCsvDate).add(30, 'days').format('YYYY-MM-DD') : '',
            submit: null
        },
        validationSchema: Yup.object({
            amount: Yup
                .number()
                .required('Amount is required'),
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
                    startDate: values.startDate,
                    endDate: values.endDate,
                    company: usuario.company
                }
                await createGoalRequest(goalData)
                props.handleClose()
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
        <Container maxWidth="lg" style={{ marginTop: '70px' }}>
            {props.open && (
                <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md">
                    <DialogTitle style={{ marginTop: "5px", marginBottom: "20px", fontSize: "bold", color: "black" }}>
                        <h1 style={{ marginBottom: '15px' }}> <LocalGroceryStoreRoundedIcon sx={{ fontSize: 45 }} /> Add Goal</h1>
                        <div><p>Las ventas previstas para el siguiente mes son: {props?.formattedTotalPredictedSales}</p></div>
                        <IconButton
                            style={{ marginTop: "5px", marginBottom: "5px" }}
                            aria-label="close"
                            onClick={props.handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
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
                                        InputProps={{
                                            readOnly: true,
                                        }}
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
                                        InputProps={{
                                            readOnly: true,
                                        }}
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
                                    <Button fullWidth size="large" sx={{ mt: 3 }} color="secondary" type="submit" variant="contained">
                                        Add Goal
                                    </Button>

                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Container>
    )
}

export default AddGoal;