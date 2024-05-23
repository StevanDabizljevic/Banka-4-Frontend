export const getApiUrl = (route: string) => {
    const koisnikRoutes = [
        '/omiljeni-korisnik',
        '/radnik',
        '/korisnik',
        '/validate-otp',
        '/generate-otp'
    ]
    const bankaRoutes = [
        '/transaction',
        '/exchange',
        '/credit',
        '/cards',
        '/racuni'
    ]
    const isKoisnikRoute = koisnikRoutes.some(prefix => route.startsWith(prefix));
    if (isKoisnikRoute) {
        return 'https://banka-4-dev.si.raf.edu.rs/user-service/api'
    }
    const isBankaRoute = bankaRoutes.some(prefix => route.startsWith(prefix));
    if (isBankaRoute) {
        return 'https://banka-4-dev.si.raf.edu.rs/banka-service/api'
    }
    return 'https://banka-4-dev.si.raf.edu.rs/berza-service/api'
}
