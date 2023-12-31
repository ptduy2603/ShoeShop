const initialState = {
    notifications: [
        { id: 1, title: 'Giày Bitis', message: 'Khám phá bộ sưu tập mới của Bitis' },
        {
            id: 2,
            title: 'Ưu đãi đặc biệt',
            message: 'Giảm giá 20% cho đôi giày Bitis bạn yêu thích',
        },
        { id: 3, title: 'Sản phẩm mới', message: 'Giày Bitis thể thao với thiết kế độc đáo' },
        {
            id: 4,
            title: 'Khám phá phong cách',
            message: 'Đôi giày Bitis làm nổi bật phong cách của bạn',
        },
        {
            id: 5,
            title: 'Bảo dưỡng giày',
            message: 'Cách chăm sóc giày Bitis để giữ đôi giày lâu bền',
        },
        {
            id: 6,
            title: 'Dòng sản phẩm cao cấp',
            message: 'Bitis Hunter - Sự lựa chọn của những người yêu thời trang',
        },
        {
            id: 7,
            title: 'Sự kiện đặc biệt',
            message: 'Tham gia sự kiện giới thiệu sản phẩm giày Bitis',
        },
        { id: 8, title: 'Trend mới', message: 'Theo kịp xu hướng thời trang với giày Bitis' },
        {
            id: 9,
            title: 'Màu sắc phong cách',
            message: 'Chọn ngay màu sắc giày Bitis phản ánh cá tính của bạn',
        },
        {
            id: 10,
            title: 'Bí quyết mix đồ',
            message: 'Làm thế nào để phối hợp đôi giày Bitis với trang phục của bạn',
        },
    ],
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        default:
            return state;
    }
};

export default notificationReducer;
