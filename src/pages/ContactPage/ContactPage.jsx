import { useEffect, useState } from "react";
import * as FeedbackService from "../../services/FeedbackService";
import Loading from "../../components/Loading/Loading";
import * as message from "../../components/Message/Message";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import "./ContactPage.scss";

function ContactPage() {
  const user = useSelector((state) => state?.dataUser);
  const [feedback, setFeedback] = useState({
    idUser: user?.id || "",
    nameUser: "",
    emailUser: "",
    title: "",
    contentFeedback: "",
  });

  const handleChangeFeedback = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const mutationAddFeeback = useMutation({
    mutationFn: (data) => {
      return FeedbackService.createFeedback(data);
    },
  });

  const { data: dataAddFeeback, isPending: isLoading } = mutationAddFeeback;

  useEffect(() => {
    if (dataAddFeeback?.status === "OK") {
      message.success(
        "Tạo phản hồi thành công. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thế"
      );
      setFeedback({
        idUser: user?.id,
        nameUser: "",
        emailUser: "",
        title: "",
        contentFeedback: "",
      });
    } else if (dataAddFeeback?.status === "ERR") {
      message.error(dataAddFeeback?.message);
    }
  }, [dataAddFeeback]);

  const handleAddFeedback = () => {
    if (!user?.id) {
      message.error("Vui lòng đăng nhập");
    } else {
      mutationAddFeeback.mutate(feedback);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="contact">
        <div className="contact__left">
          <div className="contact__left__item">
            <i className="fa-solid fa-location-dot"></i>
            <span>Thôn Rền, Tiên Du, Bắc Ninh</span>
          </div>

          <div className="contact__left__item">
            <i className="fa-regular fa-envelope"></i>
            <span>phongba08022003@gmail.com</span>
          </div>

          <div className="contact__left__item">
            <i className="fa-solid fa-phone-volume"></i>
            <span>0328927727</span>
          </div>
        </div>

        <div className="contact__right">
          <h1>Chúng tôi sẽ gọi bạn</h1>
          <p>
            Hãy nhập các thông tin vào ô trống tương ứng bên dưới, chúng tôi sẽ
            liên hệ với bạn ngay!
          </p>
          <div className="contact__right__inputnamemail">
            <input
              placeholder="Họ tên"
              name="nameUser"
              value={feedback.nameUser}
              onChange={handleChangeFeedback}
            />
            <input
              placeholder="Email"
              name="emailUser"
              value={feedback.emailUser}
              onChange={handleChangeFeedback}
            />
          </div>
          <input
            placeholder="Tiêu đề"
            name="title"
            value={feedback.title}
            onChange={handleChangeFeedback}
          />
          <textarea
            rows={4}
            cols={50}
            name="contentFeedback"
            value={feedback.contentFeedback}
            placeholder="Nội dung"
            onChange={handleChangeFeedback}
          />
          <div
            className="productdetail__infor__countproduct--buttonbuy"
            style={{ width: "170px", textAlign: "center" }}
            onClick={handleAddFeedback}
          >
            Gửi ngay
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default ContactPage;
