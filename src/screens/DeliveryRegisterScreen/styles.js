import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },

  header: {
    backgroundColor: '#2B3D52',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    position: 'relative',
  },

  menuButton: {
    padding: 6,
    marginRight: 12,
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    flex: 1,
  },

  searchBox: {
    backgroundColor: 'white',
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    width: 150,
    height: 32,
    marginRight: 12,
  },

  searchInput: {
    marginLeft: 6,
    fontSize: 16,
    color: '#2B3D52',
    flex: 1,
    height: 32,
  },

  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 100,
  },

  kozzyText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 18,
  },

  distribuidoraText: {
    color: '#D63434',
    fontSize: 14,
    fontWeight: '600',
  },

  sidebar: {
    position: 'absolute',
    width: 230,
    height: '100%',
    backgroundColor: '#2B3D52',
    paddingTop: 40,
    paddingHorizontal: 16,
    zIndex: 10,
    justifyContent: 'space-between',
  },

  sidebarUser: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 12,
  },

  userName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },

  userRole: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
  },

  sidebarDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 24,
  },

  sidebarMenu: {},

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  menuItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },

  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    width: '60%',
  },

  logoutButtonText: {
    color: '#2B3D52',
    fontWeight: '700',
  },

  contentContainer: {
    padding: 20,
  },

  registrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  registrosTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B202A',
  },

  createEntryButton: {
    backgroundColor: '#963232',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  createEntryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#2B3D52',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#2B3D52',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  tableHeaderCell: {
    fontWeight: '700',
    color: '#2B3D52',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#2B3D52',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  tableCell: {
    color: '#000000',
    fontWeight: '400',
  },

  cellDate: {
    flex: 1.1,
  },

  cellName: {
    flex: 1.6,
  },

  cellStatus: {
    flex: 1.3,
  },

  cellTime: {
    flex: 1.3,
    textAlign: 'center',
  },

  cellPlate: {
    flex: 1.4,
    textAlign: 'center',
  },

  cellEdit: {
    flex: 1.4,
    textAlign: 'right',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
  },

  statusLiberado: {
    backgroundColor: '#2AA852',
  },

  statusPendente: {
    backgroundColor: '#7E99B3',
  },

  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84786F',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default styles;