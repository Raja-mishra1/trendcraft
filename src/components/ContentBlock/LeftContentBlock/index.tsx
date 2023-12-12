import { Row, Col, Modal, Input } from "antd";
import { withTranslation } from "react-i18next";
import { SvgIcon } from "../../../common/SvgIcon";
import { ContentBlockProps } from "../types";
import { Fade } from "react-awesome-reveal";
import axios from "axios";
import { Button } from "../../../common/Button";
import {Line} from 'react-chartjs-2';
import { useState , useEffect} from "react";
// import { ChartOptions, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import {
  LeftContentSection,
  Content,
  ContentWrapper,
  ServiceWrapper,
  MinTitle,
  MinPara,
  ButtonWrapper,
} from "./styles";

const LeftContentBlock = ({
  icon,
  title,
  content,
  section,
  button,
  t,
  id,
}: ContentBlockProps) => {
  const [toggle, setToggle] = useState("LineChart");
  useEffect(() => {
    console.log(toggle)
  }, [toggle])
  const openDialog = () => {
    const imageMapping: { [key: string]: string } = {
      "1": "hoddie",
      "2": "track-jacket",
      "3": "shirt",
      "4": "shorts",
      "5": "skirt",
      "6": "sweatpants",
      "7": "tshirt",
      "8": "coat",
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

    type Item = {
      date: string;
      values: Array<{
        query: string;
        value: string;
        extracted_value: number;
      }>;
    };

    const renderGridItem = (imageSrc: string, index: number) => (
      <Col key={index} span={6} style={{ padding: "8px" }}>
        <img
          src={imageSrc}
          alt={`Image ${index + 1}`}
          style={{ width: "100%", cursor: "pointer" }}
          onClick={() => handleImageClick(index)}
        />
      </Col>
    );
    const getTrendsbasedonQuery = async (query: string) => {
      try {
        const response = await axios.post('http://0.0.0.0:5000/trends/', {
          query: query,
        });
        return response;
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const handleImageClick = async (index: number) => {
      const imageIndex = String(index + 1);
      const productType = imageMapping[imageIndex];
      const trends_data = await getTrendsbasedonQuery(productType);
      console.log(trends_data);
      const response_data = trends_data?.data?.by_interest?.timeline_data;
      const data = {
        labels: response_data.map((item: Item) => item.date),
        datasets: [
          {
            label: productType,
            data: response_data.map((item:Item) => item?.values?.[0].extracted_value),
            fill: false,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          }
        ]
      };
      Modal.info({
        title: "Trends Data",
        width: 800,
        content: (

          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {/* <Button onClick={() => setToggle((prevToggle) => (prevToggle === "LineChart" ? "BarChart" : "LineChart"))}>Toggle</Button> */}
            {toggle === "LineChart" &&  <Line data={data} />}
            {/* {toggle === "BarChart" && <div>
              <h1>Hello </h1>
            </div>} */}
          </div>
        ),
        onOk() {},
      });
    };
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
  return (
    <LeftContentSection>
      <Fade direction="left">
        <Row justify="space-between" align="middle" id={id}>
          <Col lg={11} md={11} sm={12} xs={24}>
            <SvgIcon src={icon} width="100%" height="100%" />
          </Col>
          <Col lg={11} md={11} sm={11} xs={24}>
            <ContentWrapper>
              <h6>{t(title)}</h6>
              <Content>{t(content)}</Content>
              <ServiceWrapper>
                <Row justify="space-between">
                  {typeof section === "object" &&
                    section.map((item: any, id: number) => {
                      return (
                        <Col key={id} span={11}>
                          <SvgIcon src={item.icon} width="60px" height="60px" />
                          <MinTitle>{t(item.title)}</MinTitle>
                          <MinPara>{t(item.content)}</MinPara>
                        </Col>
                      );
                    })}
                </Row>
              </ServiceWrapper>
              <ButtonWrapper>
                {typeof button === "object" &&
                  button.map((item: any, id: number) => {
                    return (
                      <Button
                        key={id}
                        color={item.color}
                        fixedWidth={true}
                        onClick={() => openDialog()}
                      >
                        {t(item.title)}
                      </Button>
                    );
                  })}
              </ButtonWrapper>
            </ContentWrapper>
          </Col>
        </Row>
      </Fade>
    </LeftContentSection>
  );
};

export default withTranslation()(LeftContentBlock);
