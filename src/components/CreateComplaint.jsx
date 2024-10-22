import {Box, Button, MenuItem, TextField, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {styled} from '@mui/material/styles';
import {useAuth} from './auth'
import {getPersonByDocument} from '../services/personService'
import {getBuildingsByTenant} from '../services/buildingService'
import {createComplaint} from '../services/complaintService'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {handleUpload} from "../services/fileService";
import ModalMessages from "./ModalMessages";

export function CreateComplaint() {
    const auth = useAuth();
    const [userData, setUserData] = useState({
        date: '',
        nameUser: ''
    })
    const [buildings, setBuildings] = useState([{
        name: '',
        address: '',
        units: [{
            unitID: '',
            unitNumber: '',
            floor: '',
        }],
        buildingID: '',
        unitID: '',
    }]);
    const [units, setUnits] = useState([{
        floor: '',
        unitNumber: ''
    }]);
    const [complaintData, setComplaintData] = useState({
        buildingName: '',
        unitID: '',
        complaintLocation: '',
        complaintDescription: '',
        image: '',
        extensionImage: ''
    });
    const [selectedImage, setSelectedImage] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('')
    const [complaintID, setComplaintID] = useState('')

    useEffect(() => {
        initialValues();
    }, [0]);

    const initialValues = async () => {
        if (auth.user !== null) {
            //set userData with login data
            const personByDocument = await getPersonByDocument(auth.user);
            setUserData({
                ...userData,
                nameUser: personByDocument.data.name
            });

            const buildingsByTenant = await getBuildingsByTenant(auth.user);

            // eslint-disable-next-line array-callback-return
            buildingsByTenant.map(building => {
                //set buildings with the buildings rented by the person
                setBuildings(prevBuilding => {
                    return [...prevBuilding,
                        {
                            name: building.buildingName,
                            address: building.buildingAddress,
                            buildingID: building.buildingID,
                            units: building.units,
                        }
                    ]
                });
            });
        }
    }

    const handleSelectBuilding = (e) => {
        //set value of building
        setComplaintData((prevState) => ({
            ...prevState,
            buildingName: e.target.value,
        }))

        //set tenant units
        const unitAux = [];
        buildings.map(building => {
            if (building.name === e.target.value.name) {
                building.units.map(unit => unitAux.push(unit))
            }
        });
        setUnits(unitAux);
    }

    const handleChange = (e) => {
        //set complaintDescription, complaintLocation, and unitID.
        setComplaintData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const truncate_image_name = (imageName, characterLimit) => {
        const fullName = imageName.split('\\').pop();
        const imageNameAndExtensionArray = fullName.split('.');
        const extension = imageNameAndExtensionArray.pop();
        const name = imageNameAndExtensionArray.join();
        const truncatedImageName = name.length > characterLimit
            ? name.slice(0, characterLimit)
            : name;
        return {
            truncatedImageName,
            extension
        };
    }

    const handleChangeImage = (e) => {
        //reset error message when select other image
        setErrorMessage('');
        setSelectedFile(e.target.files[0]);

        //truncate long image name
        const imageName = e.target.value;
        const CHARACTER_LIMIT = 70;
        const truncatedImageName = truncate_image_name(imageName, CHARACTER_LIMIT);
        const imageNameWithoutSpaces = truncatedImageName.truncatedImageName.replace(/[\s,]/g, "");
        setSelectedImage(imageNameWithoutSpaces + "." + truncatedImageName.extension);

        setComplaintData((prevState) => ({
            ...prevState,
            image: imageNameWithoutSpaces,
            extensionImage: truncatedImageName.extension
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        saveComplaint(complaintData, auth.user);
    }

    const saveComplaint = async (complaintData, documentUser) => {
        //The image size must be less than 10 MB.
        if (selectedFile.size > 10485760) {
            setErrorMessage("The image size must be less than 10 MB.");
            return;
        }
        //Create complaint
        const saveComplaintResponse = await createComplaint(complaintData, documentUser);
        if (!saveComplaintResponse.success) {
            setErrorMessage(saveComplaintResponse.error);
            return;
        }
        const responseJson = await saveComplaintResponse.data.json();

        //Save the image to a local directory.
        const saveFile = await handleUpload(selectedFile, responseJson.complaintID, selectedImage);
        if (!saveFile.success) {
            setErrorMessage(saveFile.error);
            return;
        }
        //Complaint with image submitted successfully, set complaintID
        setComplaintID(responseJson.complaintID);
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <>
            <Box
                display={"flex"}
                justifyContent="center"
                alignItems="center"
                sx={{
                    marginTop: {
                        xs: '60%',
                        md: '8%',
                        sm: '10%',
                        lg: '13%'
                    }
                }}

            >
                <form onSubmit={handleSubmit}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        padding={2}
                        maxWidth={300}
                        borderRadius={3}
                        boxShadow={'5px 5px 10px #ccc'}
                        sx={{
                            ':hover': {
                                boxShadow: '10px 10px 20px #ccc'
                            },
                            width: {
                                sm: '700px'
                            }


                        }}
                    >
                        <Typography variant='h6'>CREATE COMPLAINT</Typography>

                        <Typography variant='p' padding={1}>{userData.nameUser}- {auth.user}</Typography>

                        {<TextField
                            required={true}
                            name="building"
                            margin='normal'
                            id="outlined-select-currency"
                            select
                            label="Select building"
                            value={complaintData.buildingName}
                            onChange={handleSelectBuilding}
                            fullWidth
                            size="small"
                        >
                            {buildings.map((building) => (
                                building.name !== '' &&
                                <MenuItem key={building.buildingID} value={building}>Name: {building.name},
                                    Address: {building.address}</MenuItem>
                            ))}
                        </TextField>}

                        {units.length > 0 && <TextField
                            required={true}
                            margin='normal'
                            id="outlined-select-currency"
                            select
                            label="Select unit"
                            value={complaintData.unitID}
                            name='unitID'
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        >
                            {units.map((unit) => (
                                    unit.floor !== '' && <MenuItem key={unit.unitID} value={unit.unitID}>
                                        Floor: {unit.floor}, Unit number: {unit.unitNumber}
                                    </MenuItem>)
                            )}
                        </TextField>
                        }

                        <TextField
                            required={true}
                            margin='normal'
                            label="Complaint location"
                            value={complaintData.complaintLocation}
                            type={'text'}
                            name='complaintLocation'
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            variant='outlined'
                            xs={{
                                color: 'red'
                            }}
                        >
                        </TextField>

                        <TextField
                            required={true}
                            margin='normal'
                            type={'text'}
                            label="Complaint description"
                            value={complaintData.complaintDescription}
                            name='complaintDescription'
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            variant='outlined'>
                        </TextField>

                        <Button
                            sx={{marginTop: 2}}
                            fullWidth
                            value={complaintData.image}
                            name='image'
                            onChange={handleChangeImage}
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon/>}
                        >
                            Upload evidence
                            <VisuallyHiddenInput type="file" accept='image/*'/>
                        </Button>

                        {selectedImage !== '' &&
                            <TextField
                                type={'text'}
                                value={selectedImage}
                                name='selectedImage'
                                fullWidth
                                size="small"
                                variant='outlined'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            >
                            </TextField>}
                        {errorMessage !== '' && <p style={{color: 'red'}}>{errorMessage}</p>}
                        <Button
                            sx={{marginTop: 2}}
                            variant='contained'
                            color='primary'
                            fullWidth
                            type='submit'
                        >
                            Create
                        </Button>
                    </Box>
                </form>
                {
                    complaintID !== '' &&
                    <ModalMessages
                        title='Complaint submitted successfully!'
                        description={`Complaint Number: ${complaintID}`}
                    />
                }
            </Box>
        </>
    )
}
