import React, { useEffect, useState } from "react";
import OfficerForm from '../../components/OfficerForm';
import moment from "moment";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";;

function Profile() {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [officer, setOfficer] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backendURL = "http://localhost:5000";
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                `${backendURL}/api/officer/update-officer-profile`,
                {
                    ...values,
                    userId: user._id,
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };

    const getOfficerData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                `${backendURL}/api/officer/get-officer-info-by-user-id`,
                {
                    userId: params.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            dispatch(hideLoading());
            if (response.data.success) {
                setOfficer(response.data.data);
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getOfficerData();
    }, []);

    return (
        <Layout>
            <h1 className="page-title"> Officer Profile</h1>
            <hr />
            {officer && <OfficerForm onFinish={onFinish} initialValues={officer} />}
        </Layout>
    );
}

export default Profile;