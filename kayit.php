<?php
header("Content-Type: application/json");

// Veritabanı bağlantısı
$host = "localhost";
$port = "5432"; // veya pgAdmin'deki portu buraya yaz
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

$pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanına bağlanılamadı."]);
    exit;
}

// İstekten gelen JSON verisini al
$data = json_decode(file_get_contents("php://input"), true);

// Verileri al
$role = $data['role'] ?? '';
$adsoyad = $data['adsoyad'] ?? '';
$email = $data['email'] ?? '';
$sifre = $data['sifre'] ?? '';
$ogrenci_no = $data['ogrenci_no'] ?? null;

// Hatalı veri kontrolü
if (!$role || !$adsoyad || !$email || !$sifre) {
    echo json_encode(["status" => "error", "message" => "Lütfen tüm alanları doldurun."]);
    exit;
}

try {
    if ($role === "ogrenci") {
        $stmt = $pdo->prepare("INSERT INTO ogrenciler (isim, email, sifre, ogrenci_no) VALUES (:isim, :email, :sifre, :ogrenci_no)");
        $stmt->execute([
            'isim' => $adsoyad,
            'email' => $email,
            'sifre' => $sifre,
            'ogrenci_no' => $ogrenci_no
        ]);
    } elseif ($role === "danisman") {
        $stmt = $pdo->prepare("INSERT INTO danismanlar (isim, email, sifre) VALUES (:isim, :email, :sifre)");
        $stmt->execute([
            'isim' => $adsoyad,
            'email' => $email,
            'sifre' => $sifre
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Geçersiz kullanıcı türü."]);
        exit;
    }

    echo json_encode(["status" => "ok"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Kayıt başarısız: " . $e->getMessage()]);
}
?>
