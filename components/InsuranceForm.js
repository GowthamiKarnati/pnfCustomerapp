import { StyleSheet, Text, View,Dimensions, TouchableOpacity,ActivityIndicator,ScrollView, KeyboardAvoidingView,Modal, Alert, ToastAndroid } from 'react-native'
import React,{useState,useEffect, Children} from 'react';
import { useTranslation } from 'react-i18next';
import InputDetails from './InputDetails';
import Button from './Button';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import CustomAlert from './CustomAlert';

// import { Alert } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function InsuranceForm({mobileNumber,vehicleData,customerDetails}) {
    const {t} =useTranslation();
    const navigation = useNavigation();
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);
    // const [selected, setSelected] = useState("");
    const [numberOfTires, setNumberOfTires] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [truckNumber,setTruckNumber]=useState('');
    // const [customerDetails, setCustomerDetails] = useState(null);
    // const [vehicleData, setVehicleData] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert1, setShowAlert1] = useState(false);
    

    // const api="http://10.0.2.2:5000"
    const api = "https://pnf-backend.vercel.app/";


    const data = [
        {key:'1', value:'Bridgestone'},
        {key:'2', value:'Goodyear'},
        {key:'3', value:'Continental'},
    ]

    // const showToastWithGravityAndOffset = () => {
    //   ToastAndroid.showWithGravityAndOffset(
    //     'A wild toast appeared!',
    //     ToastAndroid.LONG,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50,
    //   );
    // };

    useEffect(()=>{
      fetchProfileData();
      // fetchCustomerKYCData();
      // fetchVehicleData();
    },[]);
    const fetchProfileData = async ()=>{
      try{
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        // console.log("Mobile number",modifiedMobileNumber);
        let url = `${api}/customer?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
        const res = await axios.get(url);
        // console.log(res.data.data[0]["DEALER reference_id"]);
        setProfile(res.data.data);
        setLoading(false);
      }catch(err){
        console.error('Error fetching data: ',err.message);
      }
    }
    // const fetchCustomerKYCData = async ()=>{
    //   try{
    //     const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
    //     // console.log("Mobile number",modifiedMobileNumber);
    //     let url = `${api}/customerKyc?criteria=sheet_42284627.column_1100.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
    //     const res = await axios.get(url);
    //     // console.log(res.data.data[0]);
    //     setCustomerDetails(res.data.data[0]);
    //     setLoading(false);
    //   }catch(err){
    //     console.error('Error fetching data: ',err.message);
    //   }
    // }

    // const fetchVehicleData = async ()=>{
    //   try{
    //     const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
    //     // console.log("Mobile number",modifiedMobileNumber);
    //     let url = `${api}/vehicles?criteria=sheet_32026511.column_609.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
    //     const res = await axios.get(url);
    //     // console.log(res.data.data);
    //     setVehicleData(res.data.data);
    //     setLoading(false);
    //   }catch(err){
    //     console.error('Error fetching data: ',err.message);
    //   }
    // }


    const handleSubmit = async () => {
      // console.log('Submit form with all details')
      // console.log(customerDetails);
      try {
        setLoading1(true);
        if (!loanAmount || !truckNumber) {
          // Show an error message to the user
          console.log('All fields are required to submit form');
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: t('toasterrmessage1'),
            text2: t('toasterrmessage2'),
            visibilityTime: 3000, // 3 seconds duration
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
          return;
        }

        // if (!customerDetails) {
        //   setShowAlert(true);
        //   return;
        // }else if(customerDetails['KYC Status']==='Inactive'){
        //   setShowAlert1(true);
        //   return;
        // }

        // if(!customerDetails){
        //     Alert.alert(
        //       'Missing Customer KYC',
        //       'Customer KYC are incomplete. Please contact the administration.',
        //       [{ 
        //           text: 'OK',
        //           // onPress:()=>navigation.navigate('Travel')
        //       }]
        //     );

        // }
        // else{

          const mobilenumber = profile[0]["mobile number"]
          // console.log("Travel",mobilenumber);
          const FullName = customerDetails["Customer Name"]
          const PanNumber = customerDetails["PAN Number"]
          const cnfPanNumber = customerDetails["PAN Number"]
          const AlternateMobileNumber = profile[0]["alternate mobile number"]
          const source = profile[0]["DEALER"]
          const sourcerefid = profile[0]["DEALER reference_id"]
          const date = new Date()
          const NoOfTrucks = profile[0]["Trucks"]
          const martialStatus = customerDetails["Marital Status"]
          const numchildren = customerDetails["Number of Children"]
          const houseType = customerDetails["House Owned or Rented"]
          const loanType = "Insurance Loan"
          const driverSalary = customerDetails["Driver Salary"]
          const monthlyEMIOutflow = customerDetails["Monthly EMI Outflow"]
          console.log(source);
          console.log("Source Ref id",sourcerefid);
  
          const response = await axios.post(`${api}/tyre`, {
            numberOfTires,
            selectedBrand,
            loanAmount,
            mobilenumber,
            FullName,
            PanNumber,
            AlternateMobileNumber,
            martialStatus,
            numchildren,
            houseType,
            truckNumber,
            source,
            sourcerefid,
            date,
            NoOfTrucks,
            cnfPanNumber,
            driverSalary,
            loanType,
            monthlyEMIOutflow
          });
  
          
          // Reset form fields after successful submission
          setNumberOfTires('');
          setLoanAmount('');
          setSelectedBrand('');
          setTruckNumber('');
          
          navigation.navigate('Dash');
          // navigation.navigate('PDFView',{mobileNumber});
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: t('toastsuccessmessage1'),
            text2: t('toastsuccessmessage2'),
            visibilityTime: 3000, // 3 seconds duration
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
          setLoading1(false);
        // }
        // Handle success or show a message to the user
      } catch (error) {
        console.error('Error submitting data:', error.message);
        // Handle error or show an error message to the user
      } finally{
        setLoading1(false);
      }
    };

    const renderFormFields = () => {
          return (
            <>
              <InputDetails
                  head={t('loanamount')}
                  placeholder={t('loanamountplace')}
                  placeholderTextColor='#888888'
                  onChangeText={(text) => setLoanAmount(text)}
              />
              <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={truckNumber}
                    onValueChange={(itemValue) => setTruckNumber(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select truck number" value="" />
                    {vehicleData && vehicleData.map((vehicle) => (
                      <Picker.Item key={vehicle["record_id"]} label={vehicle["Vehicle No."]} value={vehicle["Vehicle No."]} />
                    ))}
                  </Picker>
              </View>
              {/* <InputDetails
                  head={t('trucknum')}
                  placeholder={t('trucknumplace')}
                  placeholderTextColor='#888888'
                  onChangeText={(text) => setTruckNumber(text)}
              /> */}
            </>
          );
    };

    const renderNavigationButtons = () => {
      return (
        <View style={styles.navigationButtons}>
          <Button text={t('submitapplication')} width={width*0.58} onPress={handleSubmit} />
        </View>
      );
    };

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={100}>
      <ScrollView>
      <View style={styles.container}>
      {loading1 && (
        <Modal transparent={true} animationType='fade'>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </Modal>
      )}
      <View style={styles.FormContainer}>
        {renderFormFields()}
        {renderNavigationButtons()}
      </View>

    {/* <View style={styles.FormContainer}>
      {!showAdditionalDetails && (
        <>
          <InputDetails
            head='Number of Tires Required'
            placeholder='Enter the number of tires'
            placeholderTextColor='#888888'
            onChangeText={(text) => setNumberOfTires(text)}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBrand}
              onValueChange={(value) => setSelectedBrand(value)}
              style={styles.picker}
            >
              <Picker.Item label='Select the brand' value='' color='#888888' />
              <Picker.Item label='Bridgestone' value='Bridgestone' color='#888888' />
              <Picker.Item label='Goodyear' value='Goodyear' color='#888888' />
              <Picker.Item label='Continental' value='Continental' color='#888888' />
            </Picker>
          </View>
          <InputDetails
            head='Loan Amount'
            placeholder='Enter the loan amount'
            placeholderTextColor='#888888'
            onChangeText={(text) => setLoanAmount(text)}
          />
          <Button text='Next' width={width*0.28} onPress={handleNext} />
        </>
            )}

            {showAdditionalDetails && (
                <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={martialStatus}
                        onValueChange={(value) => setMartialStatus(value)}
                        style={styles.picker}
                      >
                        <Picker.Item label='Select Marital Status' value='' color='black' />
                        <Picker.Item label='Married' value='Married' color='black' />
                        <Picker.Item label='Single' value='Single' color='black' />
                        <Picker.Item label='Divorced' value='Divorced' color='black' />
                      </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={numchildren}
                        onValueChange={(value) => setNumChildren(value)}
                        style={styles.picker}
                      >
                        <Picker.Item label='Select Number of Children' value='' color='black' />
                        <Picker.Item label='0' value='0' color='black' />
                        <Picker.Item label='1' value='1' color='black' />
                        <Picker.Item label='2' value='2' color='black' />
                        <Picker.Item label='3' value='3' color='black' />
                        <Picker.Item label='4' value='4' color='black' />
                        <Picker.Item label='5' value='5' color='black' />
                        <Picker.Item label='6' value='6' color='black' />
                        <Picker.Item label='7' value='7' color='black' />
                        <Picker.Item label='8' value='8' color='black' />
                      </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={houseType}
                        onValueChange={(value) => setHouseType(value)}
                        style={styles.picker}
                      >
                        <Picker.Item label='Select House Type' value='' color='black' />
                        <Picker.Item label='Owned' value='Owned' color='black' />
                        <Picker.Item label='Rented' value='Rented' color='black' />
                      </Picker>
                    </View>
                    <InputDetails
                        head='Truck number'
                        placeholder='Enter Truck Number'
                        placeholderTextColor='#888888'
                        onChangeText={(text) => setTruckNumber(text)}
                    />
                    <Button text='Submit Application' width={width*0.58} onPress={handleSubmit} />
                </>
            )}
        </View> */}
        </View>
        {/* Custom alert */}
        {/* <CustomAlert
          isVisible={showAlert}
          message1="Customer KYC Missing"
          message2="Customer KYC are incomplete. Please contact the Administration."
          onClose={() => setShowAlert(false)}
        />
        <CustomAlert
          isVisible={showAlert1}
          message1="Customer KYC Inactive"
          message2="Customer KYC is inactive. Please contact the Administration."
          onClose={() => setShowAlert1(false)}
        /> */}
      </ScrollView>
    </KeyboardAvoidingView>
    // <View style={styles.FormContainer}>
    //   <InputDetails 
    //       head='Number of Tires Required' 
    //       placeholder='Enter the number of tires'
    //       placeholderTextColor='#888888'
    //       onChangeText={(text)=>setNumberOfTires(text)} 
    //   />
      // {/* Dropdown  */}
    //   {/* <SelectList 
    //     placeholder='Select the brand'
    //     setSelected={(val) => setSelectedBrand(val)} 
    //     data={data} 
    //     save="value"
    // /> */}
      // <View style={styles.pickerContainer}>
      //     <Picker
      //       selectedValue={selectedBrand}
      //       onValueChange={(value) => setSelectedBrand(value)}
      //       style={styles.picker}
      //     >
      //       <Picker.Item label='Select the brand' value='' color='black' />
      //       <Picker.Item label='Bridgestone' value='Bridgestone' color='black' />
      //       <Picker.Item label='Goodyear' value='Goodyear' color='black' />
      //       <Picker.Item label='Continental' value='Continental' color='black' />
      //     </Picker>
      //   </View>
      // <InputDetails 
      //     head='Loan Amount' 
      //     placeholder='Enter the loan amount'
      //     placeholderTextColor='#888888'
      //     onChangeText={(text)=>setLoanAmount(text)} 
      // />
      // <TouchableOpacity>
      //   <Text>Next</Text>
      // </TouchableOpacity>
      // {/* <Button text='Submit Application' width={width*0.52} onPress={handleSubmit} /> */}
    // </View>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:width*0.04,
        marginVertical:width*0.01,
        paddingVertical:width*0.02,
        borderRadius:width*0.028,
        paddingHorizontal:width*0.04,
        elevation:width*0.02,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
      borderWidth: width*0.004,
      borderRadius: width * 0.02,
      marginVertical: width * 0.008,
      height:width*0.13,
      borderColor:'#dedede',
      display:'flex',
      justifyContent:'center'
    },
    picker: {
      color: '#777777',
      fontSize:width*0.05,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center'
    },
})
