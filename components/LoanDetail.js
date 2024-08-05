import { ActivityIndicator, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext';

const { width, height } = Dimensions.get('window');


export default function LoanDetail({mobileNumber}) {
    const {t} =useTranslation();
    const [emiData, setEmiData] = useState([]);
    const [emiData1, setEmiData1] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showUpcomingEmi, setShowUpcomingEmi] = useState(true);
    const [showAllEmi, setShowAllEmi] = useState(true);

    // const api="http://10.0.2.2:5000"
    const api="https://pnf-backend.vercel.app/";
    // console.log(mobileNumber);
    useEffect(()=>{
        fetchEmiData(mobileNumber);
    },[currentPage])
    
      const fetchEmiData = async (mobileNumber)=>{
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
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
        }catch(err){
          console.error('Error fetching data in Loan Details: ',err.message);
        }
      }
      
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
              {/* <Text style={styles.text1}>{t('allemi')}</Text> */}
              <Text style={styles.text1}>All emis</Text>
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
        //marginTop:width*0.05,
        marginHorizontal:width*0.03,
        fontWeight:'400',
        //marginBottom:width*0.01
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
      marginHorizontal:width*0.05,
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
      elevation:width*0.01,
      //marginBottom:width*0.01

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