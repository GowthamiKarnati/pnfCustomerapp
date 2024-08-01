import { StyleSheet, Text, View,TouchableOpacity,Dimensions,ActivityIndicator } from 'react-native';

import React,{useState,useEffect} from 'react';
import Pdf from 'react-native-pdf';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../pages/AuthContext';
import Heading from './Heading';
import PDFHeading from './PDFHeading';
import { PDFDocument, rgb ,degrees} from 'pdf-lib'; // Import pdf-lib
import { encode as base64Encode } from 'base-64';

const { width, height } = Dimensions.get('window');

export default function PDFView() {
    const {t} =useTranslation();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { state } = useAuth();
    const [scale, setScale] = useState(1);

    const api = "https://pnf-backend.vercel.app/";

    const mobileNumber = state.loginForm.mobileNumber;

    useEffect(()=>{
        fetchTestLoanData();
    },[mobileNumber]);

    const fetchTestLoanData = async () =>{
        try{
            const modifiedMobileNumber = mobileNumber.slice(-10);
            console.log("PDF View",mobileNumber);
            const url = `${api}/testloans?criteria=sheet_59283844.column_793%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
            const res = await axios.get(url);
            // console.log(res.data.data);
            const sortedData = res.data.data.sort((a, b) => {
                return new Date(b['Last Status Updated At']) - new Date(a['Last Status Updated At']);
            });
            // console.log(sortedData[0]);
            setCustomerInfo(sortedData[0]);
            if (sortedData[0]?.PDF) {
                const pdfData = JSON.parse(sortedData[0].PDF);
                const pdfInfo = pdfData[0];
                if (pdfInfo && pdfInfo.filepath) {
                    const pdfUrl = `https://pnf.tigersheet.com/user/file/download?filepath=${pdfInfo.filepath}&column_id=1209&row_id=${sortedData[0].record_id}&list_id=59283844`;
                    console.log("pdf", pdfUrl);
                    setPdfUrl(pdfUrl);
                } else {
                    setError('Filepath not found in the PDF info.');
                }
            }

        }catch(err){
            setError('Error fetching data in Pdf:' + err.message);
        }finally {
            setLoading(false);
        }
    }
    const handleTouchMove = event => {
        if (event.nativeEvent.touches.length >= 2) {
          const touch1 = event.nativeEvent.touches[0];
          const touch2 = event.nativeEvent.touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          setScale(distance / width);
        }
      };
    

    const goToNextPage = () => {
        // Increment the current page number
        setCurrentPage(currentPage + 1);
    };

    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    const addStampToPDF = async (pdfBytes) => {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        // console.log("Pages",pages);
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const { width, height } = page.getSize();
            const stampText = `riktam`;
            page.drawText(stampText, {
                x: width/3,
                y: height/(2.3),
                size: width*0.16,
                rotate: degrees(45),
                color: rgb(0.65, 0.65, 0.65)
            });
        }
        return await pdfDoc.save();
    }

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return base64Encode(binary);
    }

    return (
        <>
        <PDFHeading icon='arrow-left' component='Dash' size={22} text={t('preview')} position={110}/>
        {loading?(
             <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ):(
        <View style={styles.container} >
            {pdfUrl && (
                        <Pdf
                            trustAllCerts={false}
                            source={{
                                uri: pdfUrl,
                                cache: true,
                            }}
                            scale={scale} 
                            fitWidth={true}
                            onLoadComplete={async(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                                // const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
                                const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
                                const pdfBytes = response.data;
                                const stampedPdfBytes = await addStampToPDF(pdfBytes);
                                const stampedPdfBase64 = arrayBufferToBase64(stampedPdfBytes);
                                setPdfUrl(`data:application/pdf;base64,${stampedPdfBase64}`); // Set the base64 representation
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={error => {
                                setError('Error loading PDF: ' + error);
                            }}
                            onPressLink={uri => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={styles.pdf}
                            fitPolicy={2}
                            // fitWidth={true}
                        />
                    )}
        </View>
        )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        width: '100%'
    },
    pdf: {
        flex:1,
        width: width,
        height:height
        //height: '100%',

    },
});
