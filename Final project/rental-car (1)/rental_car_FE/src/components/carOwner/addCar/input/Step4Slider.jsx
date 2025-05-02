import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function ControlledCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel interval={null} fade activeIndex={index} onSelect={handleSelect}>
      {images?.map((item) => (
        <Carousel.Item key={item.id}>
          {/* Giả sử mỗi item trong images có thuộc tính 'url' chứa đường dẫn ảnh */}
          <img  style={{borderRadius:"10px"}} src={item.url} className="d-block w-100" />
          <Carousel.Caption>
            {/* Thay tiêu đề và mô tả bằng dữ liệu của item */}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
