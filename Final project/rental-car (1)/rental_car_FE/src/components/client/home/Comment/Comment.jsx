import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import ConmonTitle from "../common/ConmonTitle";
import client1 from "../../../../assets/client-1.jpg";
import client2 from "../../../../assets/client-2.jpg";
import client3 from "../../../../assets/client-3.jpg";

// Dữ liệu bình luận
const comments = [
  {
    avatar: client1,
    name: "Sarah Johnson",
    rating: 4.5,
    text: "I had an amazing experience renting a car from this service. The booking process was quick and easy, and the car was in perfect condition. Highly recommend!",
  },
  {
    avatar: client2,
    name: "Michael Brown",
    rating: 5,
    text: "Excellent customer service and well-maintained cars. The team was very helpful and made sure everything was smooth from start to finish.",
  },
  {
    avatar: client3,
    name: "Emily Davis",
    rating: 4,
    text: "Good rental experience overall! The car was clean, the process was straightforward, and the prices were reasonable. Will rent again!",
  },
];

const Comment = () => {
  return (
    <Box sx={{my:{lg:10, xl:15}}}>
      <Container style={{ width: "70%" }}>
        <Box>
          <ConmonTitle
            title="What people say about us?"
            para={`Discover why our customers love renting with us! Read real reviews and testimonials 
                  to see how we deliver exceptional service.`}
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <Stack direction="row" justifyContent="center" spacing={3}>
            {comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  width: {lg:"30%" , xl:"25%"},
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  borderRadius: "10px",
                  p: "20px",
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Avatar src={comment.avatar} />
                    <Box>
                      <Typography fontSize={16} fontWeight={600} variant="body1">
                        {comment.name}
                      </Typography>
                      <Rating size="small" value={comment.rating} precision={0.5} readOnly />
                    </Box>
                  </Stack>

                  <Typography fontSize={13} fontWeight={400} variant="body1" color="text.secondary">
                    {comment.text}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Comment;
