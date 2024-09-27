function maskEmail(email: string) {
    const [localPart, domain] = email.split("@");
    let maskedEmail;
    if (localPart.length <= 2) {
        maskedEmail = localPart.charAt(0) + '*'.repeat(localPart.length - 1)
    }
    else {
        maskedEmail = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    }
    return `${maskedEmail}@${domain}`;
}

export default maskEmail;