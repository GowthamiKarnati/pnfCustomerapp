import { StyleSheet, Text, View,Switch, ActivityIndicator,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
import Heading from '../components/Heading'
import DebtForm from '../components/DebtForm'
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler'
import EMIDetails from '../components/EMIDetails';

const { width, height } = Dimensions.get('window');

export default function MyLoan({route}) {
    const {t} =useTranslation();
    // const { params = {} } = route; 
    const { mobileNumber,loanid } = route.params;
    // const { mobileNumber } = route.params;
    console.log(loanid);
    console.log(mobileNumber);
    const [isEnabled, setIsEnabled] = useState(false);
    const [combinedLoansData, setCombinedLoansData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [emiData, setEmiData] = useState([]);
    const api="https://pnf-backend.vercel.app/"
    // const api="http://10.0.2.2:5000"
    const [text, setText] = useState('English');
    const navigation = useNavigation();

    useEffect(()=>{
      fetchCombinedLoansData();
      fetchEmiData(mobileNumber);
    },[])
    const fetchCombinedLoansData = async ()=>{
        // const data = mobileNumber.indexOf(' ');
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        console.log("Mobile number",modifiedMobileNumber);

        console.log("mobileNumber",encodeURIComponent(modifiedMobileNumber))
        try{
          const cdLoanurl=`${api}/cdloans?criteria=sheet_23049202.column_56.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          const tyreLoanurl=`${api}/tyreloans?criteria=sheet_50460895.column_25.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          // const res = await axios.get(url);
          const [cdLoansRes, tyreLoansRes] = await Promise.all([
            axios.get(cdLoanurl),
            axios.get(tyreLoanurl)
          ]);

          const cdLoansData = cdLoansRes.data.data.map(cdLoan => ({
            loanId: `${t('loanid')}: ${parseInt(cdLoan["account number"])}`,
            status: t('status'),
            payStatus: cdLoan['loan status'] === 'closed' ? t('sucesspay') : t('failedpay'),
            amount: `${t('amount')}: ₹${cdLoan['loan amount']}`,
            date1: `${t('loandate')}: ${cdLoan['loan date'].split(" ")[0]}`,
            date2: `${t('schedulepay')}: ${cdLoan['next int date'].split(" ")[0]}`,
            color: cdLoan['loan status'] === 'closed' ? '#10b981' : '#ef4444'
          }));

          const tyreLoansData = tyreLoansRes.data.data.map(tyreLoan => ({
            // Map the columns for tyreloans to the common structure
            loanId: `${t('loanid')}: ${parseInt(tyreLoan["acc number"])}`,
            status: t('status'),
            payStatus: tyreLoan['Status'] === 'Closed' ? t('sucesspay') : t('failedpay'),
            amount: `${t('amount')}: ₹${tyreLoan['loan amount']}`,
            date1: `${t('loandate')}: ${tyreLoan['loan date'].split(" ")[0]}`,
            date2: `${t('schedulepay')}: ${tyreLoan['temp date'].split(" ")[0]}`,
            color: tyreLoan['Status'] === 'Closed' ? '#10b981' : '#ef4444'
          }));

          const combinedData = [...cdLoansData, ...tyreLoansData];
          // Sort the combinedData based on "Loan Date" in descending order
          combinedData.sort((a, b) => {
            const dateA = new Date(a.date1.split(": ")[1]);
            const dateB = new Date(b.date1.split(": ")[1]);
            return dateB - dateA;
          });
          setCombinedLoansData(combinedData);
          // setLoading(false);
          setLoading1(false)
          // console.log(combinedData);
          // console.log(t('status'));
        }catch(err){
          console.error('Error fetching data: ',err.message);
        }
      }

      const fetchEmiData = async (mobileNumber)=>{
        // console.log("mobileNumber",mobileNumber)
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        console.log("Mobile number Loan",modifiedMobileNumber);
        try{
          // setLoading1(true);
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
          setLoading(false);
          // console.log(res.data.data);
          // console.log(groupedEmiData);
        }catch(err){
          console.error('Error fetching data: ',err.message);
        }
      }
      // for (let key in cdLoansData[0]) {
      //   if(key=="account number")
      //       console.log(key, cdLoansData[0][key]);
      // }

      // console.log(cdLoansData[0])

      // for(let i=0;i<cdLoansData[0].length;i++)
      // {
      //   console.log(cdLoansData[0][i])
      //   if(cdLoansData[0][i]=="account number")
      //   {
      //     console.log("acctound number is ",cdLoansData[0][i])
      //   }
      // }

    // const route = useRoute();

    // useEffect(() => {
    //     if (route.params) {
    //       setIsEnabled(route.params.isEnabled || false);
    //       setText('English');
    //     }
    // }, [route.params]);

    // const toggleSwitch = () => {
    //     const nextText = isEnabled ?   'Hindi':"English";
    //     setText(nextText);
    //     navigation.navigate('MyLoanHindi', { isEnabled: !isEnabled, text: nextText });
    //     setIsEnabled(!isEnabled);
    // };


  return (
    <ScrollView>
          <Heading icon='arrow-left' component='Dash' size={22} text={t('mydebt')} position={100} />
          {loanid ? (<EMIDetails mobileNumber={mobileNumber} loanid={loanid} />):(
            <>
            {loading || loading1 ? (<ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />):
            (<>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:40}}>
                  <Text style={styles.subHeading}>{t('mydebt')}</Text>
                    {/* <View style={{display:'flex'}}>
                        <Text>{text}</Text>
                        <Switch 
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View> */}
                </View>
              {/* <Text>{cdLoansData.length}</Text> */}

              {combinedLoansData.length===0 ? (
                <View style={styles.box}>
                    <Text style={styles.text}>{t('noloan')}</Text>
                </View>
              ): (combinedLoansData.map((loan,index)=>
                  <DebtForm
                    key={index}
                    loanid={loan.loanId}
                    status={loan.status}
                    payStatus={loan.payStatus}
                    amount={loan.amount}
                    date1={loan.date1}
                    date2={loan.date2}
                    color={loan.color}
                    id={loanid}
                    emiData={emiData}
                />)
                // <DebtForm 
                //     key={index}
                //     loanid={`Loan ID: ${parseInt(loan["account number"])}`}
                //     status='Status' 
                //     payStatus={loan['loan status']==='closed'?'Payment done':'Not Paid'}
                //     amount={`Amount: ₹${loan['loan amount']}`}
                //     date1={`Loan Date: ${loan['loan date'].split(" ")[0]}`} 
                //     date2={`Scheduled Payment Date: ${loan['next int date'].split(" ")[0]}`} 
                //     color={loan['loan status']==='closed'?'#10b981':'#ef4444'} 
                // />)
              )}
                <Footer />
              </>
            )}
            </>
          )}
          {/* <DebtForm loanid='Loan ID: 789012' status='Status' payStatus='Not Paid' amount='Amount: $15,000' date1='Loan Date: 2023-11-15' date2='Scheduled Payment Date: 2024-01-15' color='#ef4444' /> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:width*0.04,
        marginVertical:width*0.02,
        fontSize:width*0.06,
        fontWeight:'500',
        color:'#000000'
    },
    box:{
      marginVertical:width*0.034,
      marginHorizontal:width*0.04,
      backgroundColor:'#FD3B28',
      padding:width*0.03,
      borderRadius:width*0.016,
      elevation:width*0.012
    },
    text:{
      textAlign:'center',
      fontSize:width*0.4,
      color:"#ffffff"
    }
})