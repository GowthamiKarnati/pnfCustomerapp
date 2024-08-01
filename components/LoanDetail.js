import { ActivityIndicator, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');


export default function LoanDetail({loanid,amount1,amount2,date1,date2,stat1,stat2,mobileNumber}) {
    const {t} =useTranslation();
    const [emiData, setEmiData] = useState([]);
    const [emiData1, setEmiData1] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state, handleLogout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const [showUpcomingEmi, setShowUpcomingEmi] = useState(true);
    const [showAllEmi, setShowAllEmi] = useState(true);

    // const api="http://10.0.2.2:5000"
    const api="https://pnf-backend.vercel.app/";
    // console.log(mobileNumber);
    useEffect(()=>{
        // console.log('Fetching Emi Data');
        fetchEmiData(state.loginForm.mobileNumber);
        // getToken();
        // sendTokenToBackend();
    },[currentPage])
    
      const fetchEmiData = async (mobileNumber)=>{
        // console.log("mobileNumber",mobileNumber)
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        //console.log("Mobile number Loan",modifiedMobileNumber);
        try{
          let url=`${api}/emi?criteria=sheet_26521917.column_35.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          const res = await axios.get(url);
          // Group emiData by loan ID
            const groupedEmiData = res.data.data.reduce((acc, emi) => {
                const loanId = emi['loan id'];
                if (!acc[loanId]) {
                acc[loanId] = [];
                }
                acc[loanId].push(emi);
                return acc;
            }, {});
          setEmiData(groupedEmiData);
          setEmiData1(res.data.data);
          setLoading(false);
          // console.log(res.data.data);
          // console.log(groupedEmiData);
        }catch(err){
          console.error('Error fetching data in Loan Details: ',err.message);
        }
      }
      // const getToken=async()=>{
      //   const authStatus = await messaging().requestPermission();
      //   const enabled =
      //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      //   if (enabled) {
      //     console.log('Authorization status:', authStatus);
      //   }
      //   const token = await messaging().getToken();
      //   const mobileNumber = state?.loginForm?.mobileNumber;
      //   console.log({token,mobileNumber});
      //   console.log("App",mobileNumber);
      //   // if (mobileNumber) {
      //   //   await sendTokenToBackend(token, mobileNumber);
      //   // }
      //   // Send the token to the backend
      //   await sendDataToBackend(token);
        
      // }
      const sendDataToBackend = async () =>{
        // console.log(tokenData);
        const tomorrow = new Date();
        // tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setDate(tomorrow.getDate()-1);
        const api = `https://pnf-backend.vercel.app/emi?criteria=sheet_26521917.column_35.column_87%20LIKE%20%22%25${encodeURIComponent(mobileNumber)}%22`;
        const res1 = await axios.get(api);
        const emiData = res1.data.data;
        const upcomingUnpaidEmis = emiData.filter(emi => emi['status']=== 'unpaid' && new Date(emi['emi date']).toDateString() === tomorrow.toDateString());
        // console.log(upcomingUnpaidEmis)

          upcomingUnpaidEmis.sort((a, b) => {
            // Assuming emiDate is a property in each emi object
            const emiDateA = a['emi date'];
            const emiDateB = b['emi date'];
          
            // Convert the dates to a comparable format (e.g., timestamp or Date object)
            const dateA = new Date(emiDateA);
            const dateB = new Date(emiDateB);
          
            // Compare the dates
            return dateA - dateB;
          });
          // console.log(`Upcoming unpaid EMIs for mobile number ${mobileNumber}:`, upcomingUnpaidEmis);
          upcomingUnpaidEmis.map(emi=>{
            const notificationData = {
              "to": token,
              "notification": {
                  "body": `Dear ${emi['customer']} you have to pay ${emi['amount']} tomorrow`,
                  "title": `Upcoming EMI for Loan ${emi['loan id']}`
              },
              "data": {
                  "data_new": "Test Data"
              }
            }
            // sendTokenToBackend(tokenList);
          })
      }
      const sendTokenToBackend = async () => {
        try {
          const tokenData=await firestore().collection('customer').get();
          const tokenList = [];
          tokenData.forEach(doc => {
            const token = doc.data().token;
            tokenList.push(token)
          });
          console.log('Token List:', tokenList);
          // console.log("Data",tokenList);
          await fetch('http://10.0.2.2:5000/receiveToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokens:tokenList }),
          });
          console.log('Token sent to backend successfully');
        } catch (error) {
          console.error('Error sending token to backend:', error);
        }
      }

      
      // useEffect(() => {
      //   // Handle foreground notifications
      //   messaging().onMessage(async remoteMessage => {
      //     console.log('Message handled in the foreground!', remoteMessage);
      //     // Display notification or update UI as needed
      //     Toast.show({
      //       type: 'info',
      //       position: 'top',
      //       text1: remoteMessage.data.title,
      //       text2: remoteMessage.data.body,
      //       visibilityTime: 10000, // 10 seconds duration
      //       autoHide: true,
      //       topOffset: 40,
      //       bottomOffset: 40,
      //     });
      //   });
      //   // Set up background message handler
      //   const unsubscribe = messaging().setBackgroundMessageHandler(
      //     async (remoteMessage) => {
      //       console.log('Message handled in the background!', remoteMessage);
      //       // You can handle the message here, e.g., show a local notification
      //     }
      //   );
      
      //   return unsubscribe;
      // }, []);
    //   console.log(emiData)
    const toggleUpcomingEmi = () => {
      setShowUpcomingEmi(!showUpcomingEmi);
    };

    const toggleAllEmi = () => {
      setShowAllEmi(!showAllEmi);
    };

    const upcomingUnpaidEmis = emiData1.filter(emi => emi['status']=== 'unpaid');

    upcomingUnpaidEmis.sort((a, b) => {
      // Assuming emiDate is a property in each emi object
      const emiDateA = a['emi date'];
      const emiDateB = b['emi date'];
    
      // Convert the dates to a comparable format (e.g., timestamp or Date object)
      const dateA = new Date(emiDateA);
      const dateB = new Date(emiDateB);
    
      // Compare the dates
      return dateA - dateB;
    });
    // console.log(upcomingUnpaidEmis);
  return (
    <View>
        {loading ? (<ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />):
        (
          Object.entries(emiData).length===0 ? (
            <View style={styles.box}>
              <Text style={styles.text}>{t('noemi')}</Text>
            </View>
          ):(
            <>
              <TouchableOpacity style={styles.box1} onPress={toggleUpcomingEmi}>
                <Text style={styles.text1}>{t('upcomingemi')}</Text>
              </TouchableOpacity>
            { showUpcomingEmi && upcomingUnpaidEmis.length === 0 ? (
              <View style={styles.box}>
                  <Text style={styles.text}>{t('noupcomingemi')}</Text>
              </View>
            ):(
              showUpcomingEmi && upcomingUnpaidEmis.length > 0 && (
                <View style={styles.container}>
                  <View style={styles.headingRow}>
                    <Text style={[styles.headingText, { width: width * 0.15 }]}>{t('loanid')}</Text>
                    <Text style={[styles.headingText, { width: width * 0.15 }]}>{t('amount')}</Text>
                    <Text style={[styles.headingText, { width: width * 0.15 }]}>{t('emidate')}</Text>
                    <Text style={[styles.headingText, { width: width * 0.25 }]}>{t('emipay')}</Text>
                  </View>
                  {/* Render upcoming unpaid EMIs in a single table */}
                  {upcomingUnpaidEmis.map ((emi,index) => (
                        <View key={index} style={styles.row}>
                          <Text style={[styles.rowText, { width: width * 0.15 }]}>{emi['loan id']}</Text>
                          <Text style={[styles.rowText, { width: width * 0.15 }]}>₹{parseInt(emi.amount)}</Text>
                          <Text style={[styles.rowText, { width: width * 0.18 }]}>{emi['emi date'].split(" ")[0]}</Text>
                          <Text style={[styles.rowText, { width: width * 0.25, color: '#ef4444' }]}>{t('unpaid')}</Text>
                        </View>
                  ))}
                </View>
              ))}
            <TouchableOpacity onPress={toggleAllEmi} style={styles.box1}>
              <Text style={styles.text1}>{t('allemi')}</Text>
            </TouchableOpacity>
            {showAllEmi && Object.entries(emiData).map(([loanId, emiList]) => (
            <View key={loanId}>
              <Text style={styles.heading}>{t('loanid')}: {loanId}</Text>
              <View style={styles.container}>
                  <View style={styles.headingRow}>
                    <Text style={[styles.headingText, { width: 80 }]}>{t('amount')}</Text>
                    <Text style={[styles.headingText, { width: 80 }]}>{t('emidate')}</Text>
                    <Text style={[styles.headingText, { width: 120 }]}>{t('emipay')}</Text>
                  </View>
                  {emiList.map((emi, index) => (
                  <View key={index} style={styles.row}>
                      <Text style={[styles.rowText, { width: 80 }]}>₹{parseInt(emi.amount)}</Text>
                      <Text style={[styles.rowText, { width: 100 }]}>{emi['emi date'].split(" ")[0]}</Text>
                      <Text style={[styles.rowText, { width: 120, color: emi['status'] === 'paid' ? '#10b981' : '#ef4444' }]}>
                      {emi['status']==='paid'?t('paid'):emi['status']==='unpaid'?t('unpaid'):t('bounced')}
                      </Text>
                </View>
                ))}
              </View>
            </View>
          )
      )}
      </>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:width*0.06,
        color:'#000000',
        marginTop:width*0.05,
        marginHorizontal:width*0.03,
        fontWeight:'400',
        marginBottom:width*0.04
    },
    container:{
        borderWidth:width*0.0019,
        borderColor:"#d5d5d5",
        marginTop:width*0.03,
        marginHorizontal:width*0.03,
        marginBottom:width*0.04
    },
    headingRow:{
        flexDirection:'row',
        backgroundColor:'#e8e8e8',
        padding:width*0.03,
        height:height*0.1,
        display:'flex',
        alignItems:'center'
    },
    headingText:{
        fontSize:width*0.038,
        color:'#000000',
        fontWeight:'500',
        textAlign:'center',
        marginHorizontal:width*0.03
    },
    row:{
        flexDirection:'row',
        padding:width*0.03,
        height:height*0.09,
        display:'flex',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#d5d5d5'
    },
    rowText:{
        fontSize:width*0.035,
        color:'#222222',
        textAlign:'center',
        marginHorizontal:width*0.026,
    },
    box:{
      marginVertical:width*0.03,
      marginHorizontal:width*0.04,
      backgroundColor:'#FD3B28',
      padding:width*0.03,
      borderRadius:width*0.018,
      elevation:width*0.01
    },
    box1:{
      marginVertical:width*0.03,
      marginHorizontal:width*0.01,
      backgroundColor:'#10b981',
      padding:width*0.03,
      borderRadius:width*0.018,
      elevation:width*0.01
    },
    text:{
      textAlign:'center',
      fontSize:width*0.04,
      color:"#ffffff"
    },
    text1:{
      textAlign:'center',
      fontSize:width*0.06,
      color:"#ffffff",
      fontWeight:'600'
    }
})