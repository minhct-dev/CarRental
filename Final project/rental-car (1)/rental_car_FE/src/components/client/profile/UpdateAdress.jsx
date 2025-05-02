import { Grid2 } from "@mui/material";
import { Form } from "react-router-dom";

const UpdateAdress = () => {
  return (
    <>
      <Grid2 size={6}>
        <Form.Group className="mb-3" id="form-password">
          <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
            Select province
          </Form.Label>
          <Form.Select name="province">
            <option value="">-- Select Province --</option>
          </Form.Select>
        </Form.Group>
      </Grid2>

      <Grid2 size={6}>
        <Form.Group className="mb-3" id="form-password">
          <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
            Select district
          </Form.Label>
          <Form.Select name="province">
            <option value="">-- Select District --</option>
          </Form.Select>
        </Form.Group>
      </Grid2>

      <Grid2 size={6}>
        <Form.Group className="mb-3" id="form-password">
          <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
            Select ward
          </Form.Label>
          <Form.Select name="province">
            <option value="">-- Select Ward --</option>
          </Form.Select>
        </Form.Group>
      </Grid2>
    </>
  );
};

export default UpdateAdress;
