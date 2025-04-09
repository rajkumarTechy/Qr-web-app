import emailjs from '@emailjs/nodejs';

export const sendEmail = async (email: string, tempCode: string) => {
    try {
        const response = await emailjs.send('service_jc78pyd', 'template_irkmpg8', {
            code: tempCode,
            email: email,
        }, {
            publicKey: "7gxGKC-8BonyOFEIE"
        });

        return response; 
    } catch (error) {
        return error; 
    }
};

