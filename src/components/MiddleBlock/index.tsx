import { Row, Col, Modal, Input, Button } from "antd";
import { withTranslation } from "react-i18next";
import { Slide } from "react-awesome-reveal";
import { MiddleBlockSection, Content, ContentWrapper } from "./styles";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
const { Configuration, OpenAIApi } = require("openai");

interface MiddleBlockProps {
  title: string;
  content: string;
  button: string;
  t: any;
  id: string;
}
interface ModalContentProps {
  // inputValue: string;
  // setInputValue: (value: string) => void;
  // handleSubmit?: (value: string) => void;
  imageLink: string;
  index: number;
  inputValue: string;
   onChange: (e: any) => void
}



const MiddleBlock = ({ title, content, button, t }: MiddleBlockProps) => {
  const [inputValue, setInputValue] = useState(""); // State to store the input value
  const inputValueCOPY = useRef('')
  const generatedImage = useRef(''); // State to store the generated image
  const generateImageArray = useRef([]); // State to store the generated image
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Add this line
  const api_key = "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";
  const scrollTo = (id: string) => {
    const element = document.getElementById(id) as HTMLDivElement;
    element.scrollIntoView({
      behavior: "smooth",
    });
  };


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Make the AconsolPI call
    let generateImagesArray = [];
    console.log("Input value:", inputValueCOPY.current);
    for (let i = 0; i < 4; i++) {
      const imageUrl = await getImagefromOpenAI(inputValueCOPY.current);
      generateImagesArray.push(imageUrl?.data);
    }
    Modal.info({
      title: "Generated Images",
      width: 800,
      content: (
        <div>
          {generateImagesArray.map((url, index) => (
            <img key={index} src={url} alt={`Generated Image ${index + 1}`} style={{ width: "50%", cursor: "pointer" }} />
          ))}
        </div>
      ),
      onOk() {},
    });
  };

  const onChange = (e:any) => {
    setInputValue(e.target.value);
  };

useEffect(() => {
  inputValueCOPY.current = inputValue;
 }, [inputValue]);

  const getImagefromOpenAI = async (prompt: string) => {
    try {
      const response = await axios.post('http://0.0.0.0:5000/style/', {
        query: prompt,
      });
      return response;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const imageLinks = [
    "https://static.ca.la/studio/product-type-images/hoodie.png",
    "https://static.ca.la/studio/product-type-images/track-jacket.png",
    "https://static.ca.la/studio/product-type-images/shirt.png",
    "https://static.ca.la/studio/product-type-images/shorts.png",
    "https://static.ca.la/studio/product-type-images/skirt.png",
    "https://static.ca.la/studio/product-type-images/sweatpants.png",
    "https://static.ca.la/studio/product-type-images/tee.png",
    "https://static.ca.la/studio/product-type-images/coat.png",
    // ... add more image links as needed
  ];
  const ModalContent = ({  imageLink, index , inputValue, onChange}: ModalContentProps) => (
    <div>
      <img
        src={imageLink}
        alt={`${index + 1}`}
        style={{ width: "50%", cursor: "pointer" }}
      />
      <Input
        placeholder="Description to customize design "
        style={{ marginTop: "20px" }}
        type="text"
        key={index}
        // value={inputValue}
        onChange={onChange}
      />
      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={handleSubmit}
        >
        Submit
      </Button>
    </div>
  );
  const renderGridItem = (imageSrc: string, index: number) => (
    <Col key={index} span={6} style={{ padding: "8px" }}>
      <img
        src={imageSrc}
        alt={` ${index + 1}`}
        style={{ width: "100%", cursor: "pointer" }}
        onClick={() => handleImageClick(index)}
      />
    </Col>
  );

  const handleImageClick = (index: number) => {
    Modal.info({
      title: "Image Details",
      width: 800,
      content:
      <ModalContent  imageLink={imageLinks[index]} index={index} inputValue={inputValue} onChange={onChange} />,
      onOk() {},
    });
  };
  const openDialog = () => {
    Modal.info({
      title: "Choose your Product type",
      width: 800,
      content: (
        <div>
          {/* 4 by 4 grid */}
          <Row gutter={16}>
            {imageLinks.map((link, index) => renderGridItem(link, index))}
          </Row>
        </div>
      ),
      onOk() {},
    });
  };
  // console.log(inputValue)
  return (
    <MiddleBlockSection>
      <Slide direction="up">
        <Row justify="center" align="middle">
          <ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h6>{t(title)}</h6>
              <Content>{t(content)}</Content>
              {button && (
                <Button name="submit" onClick={() => openDialog()}>
                  {t(button)}
                </Button>
              )}
            </Col>
          </ContentWrapper>
        </Row>
      </Slide>
    </MiddleBlockSection>
  );
};

export default withTranslation()(MiddleBlock);
