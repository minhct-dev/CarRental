import {
  Button,
  Stack,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../../api/addressApi";

const AddressModal = ({ show, handleClose, onSave }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị từ URL (nếu có)
  const provinceFromURL = searchParams.get("province");
  const districtFromURL = searchParams.get("district");
  const wardFromURL = searchParams.get("ward");

  // State chọn tỉnh, quận, phường
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);

  // Data từ API
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    getProvinceApi().then((res) => {
      setProvince(res);
      if (provinceFromURL) {
        const selected = res.find((p) => p.code === provinceFromURL);
        setSelectProvince(selected || null);
      }
    });
  }, [provinceFromURL]);

  // Khi chọn tỉnh, lấy danh sách quận/huyện
  useEffect(() => {
    if (selectProvince) {
      setSelectDistrict(null);
      setSelectWard(null); // Reset ward khi province thay đổi
      getDistrictApi(selectProvince.code).then((res) => {
        setDistrict(res);
        if (districtFromURL) {
          const selected = res.find((d) => d.code === districtFromURL);
          setSelectDistrict(selected || null);
        }
      });
    } else {
      setDistrict([]);
      setSelectDistrict(null);
      setWard([]); // Reset ward khi province không có
      setSelectWard(null);
    }
  }, [selectProvince, districtFromURL]);

  // Khi chọn quận, lấy danh sách phường/xã
  useEffect(() => {
    if (selectDistrict) {
      setSelectWard(null);
      getWardApi(selectDistrict.code).then((res) => {
        setWard(res);
        if (wardFromURL) {
          const selected = res.find((w) => w.code === wardFromURL);
          setSelectWard(selected || null);
        }
      });
    } else {
      setWard([]);
      setSelectWard(null);
    }
  }, [selectDistrict, wardFromURL]);

  // Khi nhấn Save, cập nhật URL
  const handleSave = () => {
    if (onSave) {
      if (selectProvince || selectDistrict || selectWard) {
        onSave([selectProvince, selectDistrict, selectWard]);
      } else {
        onSave(null);
      }
    }
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (selectProvince) {
        params.set("province", selectProvince.code);
      } else {
        params.delete("province");
      }
      if (selectDistrict) {
        params.set("district", selectDistrict.code);
      } else {
        params.delete("district");
      }
      if (selectWard) {
        params.set("ward", selectWard.code);
      } else {
        params.delete("ward");
      }
      params.set("page", 1); // Reset trang về 1
      return params;
    });

    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Filter By Address</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <Stack
          sx={{ my: 2 }}
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          {/* Chọn tỉnh/thành phố */}
          <Autocomplete
            disablePortal
            sx={{ width: "80%" }}
            size="small"
            options={province}
            getOptionLabel={(option) => option.name}
            value={selectProvince}
            onChange={(event, newValue) => setSelectProvince(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Province" />
            )}
          />

          {/* Chọn quận/huyện */}
          <Autocomplete
            disablePortal
            sx={{ width: "80%" }}
            size="small"
            options={district}
            getOptionLabel={(option) => option.name}
            value={selectDistrict}
            onChange={(event, newValue) => setSelectDistrict(newValue)}
            disabled={!selectProvince}
            renderInput={(params) => (
              <TextField {...params} label="Select District" />
            )}
          />

          {/* Chọn phường/xã */}
          <Autocomplete
            disablePortal
            sx={{ width: "80%" }}
            size="small"
            options={ward}
            getOptionLabel={(option) => option.name}
            value={selectWard}
            onChange={(event, newValue) => setSelectWard(newValue)}
            disabled={!selectProvince || !selectDistrict}
            renderInput={(params) => (
              <TextField {...params} label="Select Ward" />
            )}
          />
        </Stack>
      </DialogContent>

      {/* Nút hành động */}
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Close
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressModal;
